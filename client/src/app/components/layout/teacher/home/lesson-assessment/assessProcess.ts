import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
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
    private grade: GradeService,
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

        console.log(adata);
        return adata;
      })
    );
  }

  gradePoint(lessonId: string, cloList: any) {
    return forkJoin({
      grade: this.grade.getGradeByLesson(lessonId),
      weekAndCloLab: this.clo(lessonId, cloList, 'lab'),
      weekAndCloSem: this.clo(lessonId, cloList, 'sem'),
      weekAndCloBd: this.clo(lessonId, cloList, 'bd'),
    }).pipe(
      map(({ grade, weekAndCloLab, weekAndCloSem, weekAndCloBd }) => {
        const adata: any[] = [];

        adata.push(
          ...this.dddd(weekAndCloLab, grade),
          ...this.dddd(weekAndCloSem, grade),
          ...this.dddd(weekAndCloBd, grade)
        );

        console.log(adata);
        return adata;
      })
    );
  }

  dddd(data: any, grade: any) {
    const adata: any[] = [];
    data.forEach((wkc: any) => {
      const cloAttPoint = {
        cloId: wkc.id,
        avahOnoo: 0,
        sumPoints: [] as {
          studentId: string;
          point: number;
          subMethodId: string;
        }[],
      };

      const pointMap: Record<string, Record<string, number>> = {};

      wkc.week.forEach((week: string) => {
        grade.forEach((a: any) => {
          if (a.weekNumber === week) {
            a.studentGrades.forEach((a1: any) => {
              const studentId = a1.studentId?.id || a1.studentId;

              a1.grades.forEach((item: any) => {
                const subMethodId = item.id;
                const point = item.point;

                if (!pointMap[studentId]) {
                  pointMap[studentId] = {};
                }

                pointMap[studentId][subMethodId] =
                  (pointMap[studentId][subMethodId] || 0) + point;
              });
            });
          }
        });
      });

      // Convert pointMap to cloAttPoint.sumPoints[]
      for (const studentId in pointMap) {
        for (const subMethodId in pointMap[studentId]) {
          cloAttPoint.sumPoints.push({
            studentId,
            point: pointMap[studentId][subMethodId],
            subMethodId,
          });
        }
      }

      adata.push(cloAttPoint);
    });
    return adata;
  }
}
