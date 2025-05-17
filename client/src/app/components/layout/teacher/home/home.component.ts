import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../services/cloPointPlanService';
import { CLOService } from '../../../../services/cloService';
import { CurriculumService } from '../../../../services/curriculum.service';
import { StudentService } from '../../../../services/studentService';
import { TeacherService } from '../../../../services/teacherService';
import { LessonAssessmentComponent } from './lesson-assessment/lesson-assessment.component';
import { LessonCloComponent } from './lesson-clo/lesson-clo.component';
import { LessonDirectIndirectComponent } from './lesson-direct-indirect/lesson-direct-indirect.component';
import { LessonIndirectAssessComponent } from './lesson-indirect-assess/lesson-indirect-assess.component';
import { LessonInfoComponent } from './lesson-info/lesson-info.component';
import { LessonOverallAssessComponent } from './lesson-overall-assess/lesson-overall-assess.component';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { LessonPollAnalysisComponent } from './lesson-poll-analysis/lesson-poll-analysis.component';
import { LessonAdvDisadvComponent } from './lesson-adv-disadv/lesson-adv-disadv.component';
import { PdfMainService } from '../../../../services/pdf-main.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssessProcessService } from './lesson-assessment/assessProcess';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ButtonModule,
    LessonInfoComponent,
    LessonCloComponent,
    LessonPlanComponent,
    LessonAssessmentComponent,
    LessonOverallAssessComponent,
    LessonIndirectAssessComponent,
    LessonDirectIndirectComponent,
    LessonPollAnalysisComponent,
    LessonAdvDisadvComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  lessonId!: string;
  teacherId!: string;
  cloPoint: any;
  cloPoints: any;

  // үндсэн мэдээлэл
  pdfSendData: any[] = [];
  mainInfo = [];
  studentCount!: number;

  // суралцахуйн үр дүн
  clos = [];

  // төлөвлөгөө
  cloList = [];
  assessPlan: any;
  cloPlan = [];
  cloForm!: FormGroup;
  tabs: any;
  pollData: any;
  cloPlans: any;
  pollDatas: any;
  assessPlans: any;
  cloLists: any;
  lesStudent: any;

  // clo дүн
  tabDatas!: [{ title: string; content: any; value: any }];
  students!: any;

  types = [
    { label: 'Лекц', value: 'ALEC' },
    { label: 'Семинар', value: 'BSEM' },
    { label: 'Лаборатори', value: 'CLAB' },
  ];

  constructor(
    private assessProcess: AssessProcessService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private service: CurriculumService,
    private cloService: CLOService,
    private assessService: AssessmentService,
    private pdfMainService: PdfMainService,
    private cloPointPlanService: CloPointPlanService
  ) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.teacherId = (localStorage.getItem('teacherId') as string) || '';
    this.readMainInfo();
    this.readClos();
    this.readPlan();
  }

  readMainInfo() {
    this.service.getMainInfo(this.lessonId).subscribe((response: any) => {
      if (response) {
        this.mainInfo = response;
      }
    });

    this.studentService.getStudents(this.lessonId).subscribe((res) => {
      this.students = res;
      this.studentCount = res.length;
    });
  }

  readClos() {
    this.cloService.getCloList(this.lessonId).subscribe((data: any) => {
      this.clos = data.map((item: any) => {
        const typeLabel = this.types.find(
          (type) => type.value === item.type
        )?.label;

        return {
          id: item.id,
          type: typeLabel,
          cloName: item.cloName,
          knowledge: item.knowledge || false,
          skill: item.skill || false,
          attitude: item.attitude || false,
        };
      });
    });
  }

  readPlan() {
    forkJoin([
      this.teacherService.getCloList(this.lessonId),
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
      this.service.getPollQuesLesson(this.lessonId),
    ]).subscribe(([cloList, cloPlan, assessPlan, pollData]) => {
      this.cloList = cloList;
      this.assessPlan = assessPlan;
      this.cloPlan = cloPlan;
      this.pollDatas = pollData;
    });
  }
  createRows(cloList: any, cloPlan: any) {
    this.cloPoint = [];

    const cloRows = cloList.map((item: any) => {
      const procPointsArray = this.fb.array<FormGroup>([]);
      const examPointsArray = this.fb.array<FormGroup>([]);

      cloPlan.forEach((plan: any) => {
        plan.subMethods.forEach((sub: any) => {
          const pointGroup = this.fb.group({
            subMethodId: sub._id,
            point: [0],
          });

          if (plan.methodType !== 'EXAM') {
            procPointsArray.push(pointGroup);
          } else if (plan.methodType === 'EXAM') {
            examPointsArray.push(pointGroup);
          }
        });
      });

      this.cloPoint.push({
        lessonId: this.lessonId,
        cloId: item.id,
        cloName: item.cloName,
        cloType: item.type,
        procPoints: procPointsArray.value,
        examPoints: examPointsArray.value,
      });

      return this.fb.group({
        cloId: item.id,
        lessonId: this.lessonId,
        cloType: item.type,
        procPoints: procPointsArray,
        examPoints: examPointsArray,
      });
    });

    this.cloForm = this.fb.group({
      cloRows: this.fb.array(cloRows),
    });
  }

  pdfToConvert() {
    this.pdfSendData = [];
    forkJoin([
      this.service.getCloList(this.lessonId),
      this.service.getPollQuesLesson(this.lessonId),
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
      this.service.getLessonByStudent(this.lessonId),
    ]).subscribe(([cloList, pollData, cloPlan, assessPlan, lesStudent]) => {
      this.cloLists = cloList;
      this.assessPlans = assessPlan;
      this.pollDatas = pollData;
      this.lesStudent = lesStudent;
      // this.pdfSendData.push(this.assessPlans);
      this.cloPoints = this.cloPlan.map((clo: any) => ({
        ...clo,
        cloName:
          this.cloLists.find((c: any) => (c.id || c._id) === clo.cloId)?.cloName ??
          '-',
      }));
      // this.pdfSendData.push(this.cloPoints);
      this.cloPlans = cloPlan;
      if (Array.isArray(this.cloPlans) && this.cloPlans.length === 0) {
        this.createRows(this.cloLists, this.assessPlans.plans);
      }
      this.tabs = this.cloLists.map((item: any, index: number) => ({
        id: item.id,
        title: item.cloName,
        content: [],
        assessPlan: [],
        totalPoint: 0,
        value: index,
      }));
      this.read();

      if (this.assessPlans.plans && this.tabs.length) {
        const assessPlanMap = new Map();
        this.cloPlans.forEach((plan: any) => {
          const assessPlan = [...plan.examPoints, ...plan.procPoints].filter(
            (ePoint) => ePoint.point !== 0
          );
          assessPlanMap.set(plan.cloId, assessPlan);
        });

        this.tabs.forEach((item: any) => {
          const assessPlan = assessPlanMap.get(item.id) || [];
          item.assessPlan = assessPlan.map((col: { subMethodId: string }) => ({
            ...col,
            subMethodName: this.getSubMethodName(col.subMethodId), // Precompute the name
          }));
          item.totalPoint = assessPlan.reduce(
            (acc: any, curr: { point: any }) => acc + (curr.point || 0),
            0
          );
        });

        if (this.students) {
          this.tabs.forEach((item: any) => {
            item.content = this.students.map((stu: any) => {
              const points = item.assessPlan.map((plan: any) => ({
                subMethodId: plan.subMethodId,
                point: 0,
              }));

              return {
                studentId: stu.id,
                studentCode: stu.studentCode,
                studentName: stu.studentName,
                points,
                totalPoint: 0,
                percentage: 0,
                letterGrade: '',
              };
            });
          });
        }
      }
    });
  }
  pdfTo() {
    this.pdfSendData = [];
    const assessPlans = this.assessPlan;
    const cloLength = assessPlans.plans.length - 1;
    if (assessPlans.plans[cloLength].methodType !== 'EXAM') {
      const [row] = assessPlans.plans.splice(cloLength - 1, 1); // Олдсон мөрийг салгаж авна
      assessPlans.plans.push(row);
    }
    this.pdfSendData.push(assessPlans);
    this.pdfSendData.push(this.cloPoints);
    this.pdfSendData.push(this.tabs);
    this.pdfSendData.push(this.pollDatas);
    this.pdfSendData.push(this.mainInfo);
    this.pdfSendData.push(this.lesStudent);
    this.pdfSendData.push(this.cloList);
    this.pdfMainService.generatePdfAll(this.pdfSendData);
  }

  getSubMethodName(e: string): string {
    let name = '';
    this.assessPlan.plans.map((pl: any) => {
      pl.subMethods.map((sub: any) => {
        if (sub._id === e) {
          name = sub.subMethod;
        }
      });
    });
    return name;
  }

  read() {
    this.assessProcess.gradePoint(this.lessonId).subscribe((gradeData) => {
      this.tabs.forEach((item: any) => {
        gradeData.map((grades: any) => {
          if (item.id === grades.cloId) {
            item.content.forEach((studentRow: any) => {
              let total = 0;

              studentRow.points.forEach((pointItem: any) => {
                const grade = grades.sumPoints.find(
                  (g: any) =>
                    g.studentId === studentRow.studentId &&
                    g.subMethodId === pointItem.subMethodId
                );

                if (grade) {
                  pointItem.point = grade.point;
                  total += grade.point;
                }
              });

              studentRow.totalPoint += total;

              studentRow.percentage =
                (studentRow.totalPoint / item.totalPoint) * 100;

              studentRow.letterGrade = this.getLetterGrade(
                studentRow.percentage
              );
            });
          }
        });
      });
    });

    this.assessProcess
      .studentAttPoint(
        this.lessonId,
        this.cloList,
        this.assessPlans,
        this.cloPlan
      )
      .subscribe((data) => {
        const pointMap = new Map<string, Map<string, number>>();

        data.forEach((attendance: any) => {
          const key = `${attendance.cloId}_${attendance.subMethodId}`; // Composite key
          if (!pointMap.has(key)) {
            pointMap.set(key, new Map());
          }

          attendance.sumPoints.forEach((sp: any) => {
            const floatPoint = Number(parseFloat(sp.statusPoint));
            pointMap.get(key)!.set(sp.studentId, floatPoint);
          });
        });

        // Update studentRow.points with values from pointMap
        this.tabs.forEach((tab: any) => {
          tab.content.forEach((studentRow: any) => {
            let total = 0;
            studentRow.points.forEach((point: any) => {
              const key = `${tab.id}_${point.subMethodId}`;
              const studentPoints = pointMap.get(key);
              if (studentPoints && studentPoints.has(studentRow.studentId)) {
                point.point = studentPoints.get(studentRow.studentId);
                total += studentPoints.get(studentRow.studentId) || 0;
              }
            });
            studentRow.totalPoint += total;
            studentRow.percentage =
              (studentRow.totalPoint / tab.totalPoint) * 100;
            studentRow.letterGrade = this.getLetterGrade(studentRow.percentage);
          });
        });
      });

    this.assessProcess
      .studentActivityPoint(this.lessonId, this.assessPlans, this.cloPlan)
      .subscribe((data) => {
        const pointMap = new Map<string, Map<string, number>>();

        data.forEach((activity: any) => {
          const key = `${activity.cloId}_${activity.subMethodId}`; // Composite key
          if (!pointMap.has(key)) {
            pointMap.set(key, new Map());
          }

          activity.sumPoints.forEach((sp: any) => {
            const floatPoint = Number(parseFloat(sp.statusPoint));
            pointMap.get(key)!.set(sp.studentId, floatPoint);
          });
        });

        this.tabs.forEach((tab: any) => {
          tab.content.forEach((studentRow: any) => {
            let total = 0;
            studentRow.points.forEach((point: any) => {
              const key = `${tab.id}_${point.subMethodId}`;
              const studentPoints = pointMap.get(key);
              if (studentPoints && studentPoints.has(studentRow.studentId)) {
                point.point = studentPoints.get(studentRow.studentId);
                total += studentPoints.get(studentRow.studentId) || 0;
              }
            });
            studentRow.totalPoint += total;
            studentRow.percentage =
              (studentRow.totalPoint / tab.totalPoint) * 100;
            studentRow.letterGrade = this.getLetterGrade(studentRow.percentage);
          });
        });
      });

    this.assessProcess
      .studentExamPointProcess(this.lessonId, this.cloList)
      .subscribe((data) => {
        this.tabs.forEach((item: any) => {
          data.forEach((grades: any) => {
            if (item.id === grades.cloId) {
              item.content.forEach((studentRow: any) => {
                let total = 0;
                let takeTotal = 0;
                let alltotal = 0;

                studentRow.points.forEach((pointItem: any) => {
                  const grade = grades.sumPoint.find(
                    (g: any) =>
                      g.studentId === studentRow.studentCode &&
                      g.subMethodId === pointItem.subMethodId
                  );

                  if (grade) {
                    const plan = item.assessPlan.find(
                      (pla: any) => pla.subMethodId === grade.subMethodId
                    );

                    const point = plan ? plan.point : 0;

                    alltotal += grade.allPoint;
                    takeTotal += grade.totalPoint;
                    pointItem.point = (takeTotal * point) / (alltotal || 1);
                    total += pointItem.point;
                  }
                });

                studentRow.totalPoint += total;
                studentRow.percentage =
                  (studentRow.totalPoint / item.totalPoint) * 100;
                studentRow.letterGrade = this.getLetterGrade(
                  studentRow.percentage
                );
              });
            }
          });
        });
        // this.pdfSendData.push(this.tabs);
        this.pdfTo();
      });
  }

  getLetterGrade(percent: number): string {
    if (percent > 90) return 'A';
    if (percent > 80) return 'B';
    if (percent > 70) return 'C';
    if (percent > 60) return 'D';
    return 'F';
  }
}
