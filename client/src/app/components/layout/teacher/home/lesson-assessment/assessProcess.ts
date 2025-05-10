import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ActivityService } from '../../../../../services/activityService';
import { AssessmentPlanService } from '../../../../../services/assessmentPlanService';
import { AssessmentService } from '../../../../../services/assessmentService';
import { AttendanceService } from '../../../../../services/attendanceService';
import { GradeService } from '../../../../../services/gradeService';
import { lessonAssessmentService } from '../../../../../services/lessonAssessment';

@Injectable({
  providedIn: 'root',
})
export class AssessProcessService {
  constructor(
    private assess: AssessmentService,
    private attend: AttendanceService,
    private activityService: ActivityService,
    private assessPlan: AssessmentPlanService,
    private gradeService: GradeService,
    private lessonAssessmentService: lessonAssessmentService
  ) {}

  readSchedules(lessonId: string) {
    return forkJoin({
      lecSchedule: this.assess.getSchedules(lessonId).pipe(
        map((res: any[]) =>
          res.map((item) => ({
            ...item,
            cloRelevance: item.cloRelevance?.id ?? null, // 👈 safe access
          }))
        )
      ),
      semSchedule: this.assess.getScheduleSems(lessonId).pipe(
        map((res: any[]) =>
          res.map((item) => ({
            ...item,
            cloRelevance: item.cloRelevance?.id ?? null,
          }))
        )
      ),
      labSchedule: this.assess.getScheduleLabs(lessonId).pipe(
        map((res: any[]) =>
          res.map((item) => ({
            ...item,
            cloRelevance: item.cloRelevance?.id ?? null,
          }))
        )
      ),
      bdSchedule: this.assess.getScheduleBds(lessonId).pipe(
        map((res: any[]) =>
          res.map((item) => ({
            ...item,
            cloRelevance: item.cloRelevance?.id ?? null,
          }))
        )
      ),
    });
  }

  clo(lessonId: string, cloList: any, type: string) {
    return this.readSchedules(lessonId).pipe(
      map((schedule: any) => {
        const cloAndWeek: any[] = [];

        const scheduleMap: Record<string, any[]> = {
          lec: schedule?.lecSchedule,
          sem: schedule?.semSchedule,
          lab: schedule?.labSchedule,
          bd: schedule?.bdSchedule,
        };

        const selectedSchedule = scheduleMap[type];

        if (!selectedSchedule) return cloAndWeek;

        cloList.forEach((item: any) => {
          const weekList = selectedSchedule
            .filter((entry: any) => entry.cloRelevance === item.id)
            .map((entry: any) => entry.week);

          cloAndWeek.push({
            id: item.id,
            week: weekList,
          });
        });

        return cloAndWeek;
      })
    );
  }

  studentExamPoint(lessonId: string, type: string): Observable<any[]> {
    return this.lessonAssessmentService.getLesAssessment(lessonId).pipe(
      map((res) => {
        return res.filter((exam: any) => exam.examType === type);
      })
    );
  }

  studentExamPointProcess(lessonId: string, cloList: any[]): Observable<any[]> {
    const studentPoints: {
      students: any;
      cloId: string;
      type: string;
    }[] = [];

    const types = ['QUIZ1', 'QUIZ2', 'EXAM'];
    const allObservables: Observable<any>[] = [];

    types.forEach((type) => {
      cloList.forEach((clo: any) => {
        const obs$ = this.studentExamPoint(lessonId, type).pipe(
          map((data: any[]) => {
            const students = data.map((item: any) => {
              let allPointSum = 0;
              let takePointSum = 0;
              item.question.forEach((que: any) => {
                if (que.cloId === clo.id) {
                  allPointSum += Number(que.allPoint) || 0;
                  takePointSum += Number(que.takePoint) || 0;
                }
              });
              return {
                studentCode: item.studentId,
                allPoint: allPointSum,
                takePoint: takePointSum,
              };
            });

            studentPoints.push({
              students,
              cloId: clo.id,
              type,
            });
          })
        );

        allObservables.push(obs$);
      });
    });

    return forkJoin(allObservables).pipe(map(() => studentPoints));
  }

  studentAttPoint(
    lessonId: string,
    cloList: any,
    pointPlan: any,
    cloPlan: any
  ) {
    return forkJoin({
      attendance: this.attend.getAttendanceByLesson(lessonId),
      weekAndCloLec: this.clo(lessonId, cloList, 'lec'),
      weekAndCloSem: this.clo(lessonId, cloList, 'sem'),
      weekAndCloLab: this.clo(lessonId, cloList, 'lab'),
    }).pipe(
      map(({ attendance, weekAndCloLec, weekAndCloSem, weekAndCloLab }) => {
        let subMethodId = '';
        const points: { cloId: any; subMethodId: string; point: any }[] = [];
        pointPlan.plans.map((item: any) => {
          if (item.methodType === 'PARTI') {
            subMethodId = item.subMethods[0]._id;
          }
        });
        cloPlan.map((item: any) => {
          item.procPoints.map((proc: any) => {
            if (proc.subMethodId === subMethodId) {
              if (proc.point == 0) {
                return;
              }
              const point = {
                cloId: item.cloId,
                subMethodId: subMethodId,
                point: proc.point,
              };
              points.push(point);
            }
          });
        });
        const adata: any[] = [];

        const processClo = (wkcList: any[], type: string) => {
          wkcList.forEach((wkc: any) => {
            const avahOnoo = wkc.week.length;
            if (avahOnoo === 0) return;

            const cloAttPoint = {
              cloId: wkc.id,
              avahOnoo,
              subMethodId: subMethodId,
              sumPoints: [] as { studentId: string; statusPoint: number }[],
            };

            const pointMap: Record<string, number> = {};

            wkc.week.forEach((week: string) => {
              attendance.forEach((a: any) => {
                if (a.weekNumber === week && a.type === type) {
                  a.attendance.forEach((a1: any) => {
                    const studentId = a1.studentId?.id || a1.studentId;
                    const point = a1.status === false ? 0 : 1;

                    pointMap[studentId] = (pointMap[studentId] || 0) + point;
                  });
                }
              });
            });

            for (const studentId in pointMap) {
              cloAttPoint.sumPoints.push({
                studentId,
                statusPoint: pointMap[studentId],
              });
            }

            adata.push(cloAttPoint);
          });
        };

        processClo(weekAndCloLec, 'alec');
        processClo(weekAndCloSem, 'bsem');
        processClo(weekAndCloLab, 'clab');

        adata.map((item: any) => {
          points.map((po: any) => {
            if (po.cloId === item.cloId) {
              item.sumPoints.map((sp: any) => {
                sp.statusPoint = (sp.statusPoint * po.point) / item.avahOnoo;
              });
              item.cloId = po.cloId;
            }
          });
        });

        return adata;
      })
    );
  }

  studentActivityPoint(lessonId: string, pointPlan: any, cloPlan: any) {
    return forkJoin({
      activity: this.activityService.getActivityByLesson(lessonId),
    }).pipe(
      map(({ activity }) => {
        let subMethodId = '';
        const points: { cloId: any; subMethodId: string; point: any }[] = [];
        pointPlan.plans.map((item: any) => {
          if (item.methodType === 'PARTI' && item.subMethods.length == 2) {
            subMethodId = item.subMethods[1]._id;
          }
        });
        const adata: any[] = [];
        if (subMethodId !== '') {
          cloPlan.map((item: any) => {
            item.procPoints.map((proc: any) => {
              if (proc.subMethodId === subMethodId) {
                if (proc.point == 0) {
                  return;
                }
                const point = {
                  cloId: item.cloId,
                  subMethodId: subMethodId,
                  point: proc.point,
                };
                points.push(point);
              }
            });
          });

          points.map((po: any) => {
            const cloAttPoint = {
              cloId: po.cloId,
              subMethodId: po.subMethodId,
              sumPoints: [] as { studentId: string; statusPoint: number }[],
            };
            adata.push(cloAttPoint);
          });

          const studentTotalPoints = new Map<
            string,
            { studentName: string; totalPoint: number }
          >();

          activity.forEach((week) => {
            week.activity.forEach((act: any) => {
              const id = act.studentId.id;
              const name = act.studentId.studentName;
              const point = act.point;

              if (!studentTotalPoints.has(id)) {
                studentTotalPoints.set(id, {
                  studentName: name,
                  totalPoint: 0,
                });
              }

              const current = studentTotalPoints.get(id)!;
              current.totalPoint += point;
            });
          });

          // Хуваарилах процесс
          studentTotalPoints.forEach((value, studentId) => {
            let remaining = value.totalPoint;

            for (const cloAttPoint of adata) {
              const po = points.find(
                (p) =>
                  p.cloId === cloAttPoint.cloId &&
                  p.subMethodId === cloAttPoint.subMethodId
              );
              if (!po || po.point === 0) continue;

              const assign = Math.min(remaining, po.point);
              remaining -= assign;

              cloAttPoint.sumPoints.push({
                studentId: studentId,
                statusPoint: assign,
              });

              if (remaining <= 0) break;
            }
          });
        }
        return adata;
      })
    );
  }

  gradePoint(lessonId: string) {
    return forkJoin({
      grade: this.gradeService.getGradeByLesson(lessonId),
      assess: this.assessPlan.getAssessmentPlan(lessonId),
    }).pipe(
      map(({ grade, assess }) => {
        const cloMap = new Map<string, { cloId: string; sumPoints: any[] }>();

        for (const g of grade) {
          for (const student of g.studentGrades) {
            const studentId = student.studentId.id;

            for (const gr of student.grades) {
              const cloId = gr.cloId;
              const subMethodId = gr.id;
              const point = gr.point;

              if (!cloMap.has(cloId)) {
                cloMap.set(cloId, {
                  cloId,
                  sumPoints: [],
                });
              }

              const cloData = cloMap.get(cloId)!;

              // Бэлэн эсэхийг шалгах
              const existing = cloData.sumPoints.find(
                (sp) =>
                  sp.studentId === studentId && sp.subMethodId === subMethodId
              );

              if (existing) {
                existing.point += point;
              } else {
                cloData.sumPoints.push({
                  studentId,
                  point,
                  subMethodId,
                });
              }
            }
          }
        }

        const adata = Array.from(cloMap.values());
        return adata;
      })
    );
  }
}
