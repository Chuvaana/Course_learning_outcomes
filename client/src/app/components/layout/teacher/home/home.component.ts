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
  cloPoint : any;

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
    ]).subscribe(([cloList, cloPlan, assessPlan]) => {
      this.cloList = cloList;
      this.assessPlan = assessPlan;
      this.cloPlan = cloPlan;
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
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
    ]).subscribe(([cloList, cloPlan, assessPlan]) => {
      this.cloList = cloList;
      this.assessPlan = assessPlan;
      this.pdfSendData.push(this.assessPlan);
      this.pdfSendData.push(this.cloPlan);
      this.cloPlan = cloPlan;
      if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
        this.createRows(this.cloList, this.assessPlan.plans);
      }
      this.tabs = this.cloList.map((item: any, index: number) => ({
        id: item.id,
        title: item.cloName,
        content: [],
        assessPlan: [],
        totalPoint: 0,
        value: index,
      }));
      this.read();

    if (this.assessPlan.plans && this.tabs.length) {
      const assessPlanMap = new Map();
      this.cloPlan.forEach((plan: any) => {
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
    console.log('cloList : ' + this.cloList + '\n assessPlan : ' + this.assessPlan + '\n cloPlan : ' + this.cloPlan);
    if (this.lessonId !== null && this.lessonId !== undefined) {
    }
  }
  pdfTo(){
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
    this.assessProcess
      .gradePoint(this.lessonId, this.cloList)
      .subscribe((gradeData) => {
        this.tabs.forEach((item: any) => {
          item.content.forEach((studentRow: any) => {
            let total = 0;

            studentRow.points.forEach((pointItem: any) => {
              const grade = gradeData
                .find((g: any) =>
                  g.sumPoints.find(
                    (s: any) =>
                      s.studentId === studentRow.studentId &&
                      s.subMethodId === pointItem.subMethodId
                  )
                )
                ?.sumPoints.find(
                  (s: any) =>
                    s.studentId === studentRow.studentId &&
                    s.subMethodId === pointItem.subMethodId
                );

              if (grade) {
                pointItem.point = grade.point;
                total += grade.point;
              }
            });

            studentRow.totalPoint = total;
            studentRow.percentage = +((total / item.totalPoint) * 100).toFixed(
              2
            );
            studentRow.letterGrade = this.getLetterGrade(studentRow.percentage);
          });
        });
        this.pdfSendData.push(this.tabs);
        this.pdfTo();
      });
    this.assessProcess
      .studentAttPoint(
        this.lessonId,
        this.cloList,
        this.assessPlan,
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
            const floatPoint = Number(parseFloat(sp.statusPoint).toFixed(2));
            pointMap.get(key)!.set(sp.studentId, floatPoint);
          });
        });

        // Update studentRow.points with values from pointMap
        this.tabs.forEach((tab: any) => {
          tab.content.forEach((studentRow: any) => {
            studentRow.points.forEach((point: any) => {
              const key = `${tab.id}_${point.subMethodId}`;
              const studentPoints = pointMap.get(key);
              if (studentPoints && studentPoints.has(studentRow.studentId)) {
                point.point = studentPoints.get(studentRow.studentId);
              }
            });
          });
        });
      });

    this.assessProcess
      .studentActivityPoint(this.lessonId, this.assessPlan, this.cloPlan)
      .subscribe((data) => {
        const pointMap = new Map<string, Map<string, number>>();

        data.forEach((activity: any) => {
          const key = `${activity.cloId}_${activity.subMethodId}`; // Composite key
          if (!pointMap.has(key)) {
            pointMap.set(key, new Map());
          }

          activity.sumPoints.forEach((sp: any) => {
            const floatPoint = Number(parseFloat(sp.statusPoint).toFixed(2));
            pointMap.get(key)!.set(sp.studentId, floatPoint);
          });
        });

        // Update studentRow.points with values from pointMap
        this.tabs.forEach((tab: any) => {
          tab.content.forEach((studentRow: any) => {
            studentRow.points.forEach((point: any) => {
              const key = `${tab.id}_${point.subMethodId}`;
              const studentPoints = pointMap.get(key);
              if (studentPoints && studentPoints.has(studentRow.studentId)) {
                point.point = studentPoints.get(studentRow.studentId);
              }
            });
          });
        });
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
