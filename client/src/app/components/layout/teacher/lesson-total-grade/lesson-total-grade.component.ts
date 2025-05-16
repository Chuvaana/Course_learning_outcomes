import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../services/cloPointPlanService';
import { StudentService } from '../../../../services/studentService';
import { TeacherService } from '../../../../services/teacherService';
import { AssessProcessService } from '../home/lesson-assessment/assessProcess';
@Component({
  selector: 'app-lesson-total-grade',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    ProgressSpinnerModule,
    ChartModule,
  ],
  templateUrl: './lesson-total-grade.component.html',
  styleUrl: './lesson-total-grade.component.scss',
})
export class LessonTotalGradeComponent {
  cloList: any;
  lessonId!: string;
  pointPlan: any;
  cloPlan: any;
  students: any;
  tabs: {
    id: string;
    title: string;
    totalPoint: number;
    content: any;
  }[] = [];
  tabsReady = false;

  chartData: any;
  chartOptions: any;
  percentageChartData: any;
  percentageChartOptions: any;

  @ViewChild('chartWrapper') chartWrapper!: ElementRef;

  constructor(
    private assessProcess: AssessProcessService,
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private assessService: AssessmentService,
    private cloPointPlanService: CloPointPlanService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
      forkJoin([
        this.teacherService.getCloList(this.lessonId),
        this.cloPointPlanService.getPointPlan(this.lessonId),
        this.studentService.getStudents(this.lessonId),
        this.assessService.getAssessmentByLesson(this.lessonId),
      ]).subscribe(([cloList, cloPlan, students, assessPlan]) => {
        this.cloList = cloList;
        this.cloPlan = cloPlan;
        this.pointPlan = assessPlan;
        this.students = students;
        console.log(this.pointPlan);
        this.pointPlan.plans.map((item: any) => {
          item.subMethods.map((sub: any) => {
            this.tabs.push({
              id: sub._id,
              title: sub.subMethod,
              totalPoint: sub.point,
              content: '',
            });
          });
        });
        if (this.tabs.length) {
          if (this.students) {
            this.tabs.forEach((item: any) => {
              item.content = this.students.map((stu: any) => {
                return {
                  studentId: stu.id,
                  studentCode: stu.studentCode,
                  studentName: stu.studentName,
                  totalPoint: 0,
                  percentage: 0,
                  letterGrade: '',
                };
              });
            });
          }
          this.readData();
        }
      });
    });
  }

  readData() {
    forkJoin([
      this.assessProcess.gradePointMethod(this.lessonId),
      this.assessProcess.studentAttPoint(
        this.lessonId,
        this.cloList,
        this.pointPlan,
        this.cloPlan
      ),
      this.assessProcess.studentActivityPoint(
        this.lessonId,
        this.pointPlan,
        this.cloPlan
      ),
      this.assessProcess.studentExamPointProcessMethod(
        this.lessonId,
        this.cloList
      ),
    ]).subscribe(([gradeData, attData, actData, examData]) => {
      console.log(examData);
      this.tabs.forEach((item: any) => {
        gradeData.forEach((grades: any) => {
          if (item.id === grades.subMethodId) {
            type StudentPoint = {
              studentId: string;
              point: number;
            };

            const grouped = grades.sumPoints.reduce(
              (acc: Record<string, number>, curr: StudentPoint) => {
                acc[curr.studentId] = (acc[curr.studentId] || 0) + curr.point;
                return acc;
              },
              {}
            );

            item.content.forEach((studentRow: any) => {
              const total = grouped[studentRow.studentId] || 0;

              studentRow.totalPoint = total;
              studentRow.percentage = +(
                (total / item.totalPoint) *
                100
              ).toFixed(2);
            });
          }
        });
      });
      this.tabs.forEach((item: any) => {
        attData.forEach((attendance: any) => {
          if (item.id === attendance.subMethodId) {
            item.content.forEach((studentRow: any) => {
              attendance.sumPoints.map((poi: any) => {
                if (poi.studentId == studentRow.studentId) {
                  studentRow.totalPoint += poi.statusPoint;
                }
              });
              studentRow.percentage = +(
                (studentRow.totalPoint / item.totalPoint) *
                100
              ).toFixed(2);
            });
          }
        });
      });
      this.tabs.forEach((item: any) => {
        actData.forEach((activity: any) => {
          if (item.id === activity.subMethodId) {
            item.content.forEach((studentRow: any) => {
              activity.sumPoints.map((poi: any) => {
                if (poi.studentId == studentRow.studentId) {
                  studentRow.totalPoint += poi.statusPoint;
                }
              });
              studentRow.percentage = +(
                (studentRow.totalPoint / item.totalPoint) *
                100
              ).toFixed(2);
            });
          }
        });
      });
      this.tabs.forEach((item: any) => {
        examData.forEach((examPo: any) => {
          if (item.id === examPo.subMethodId) {
            item.content.forEach((studentRow: any) => {
              let total = 0;
              let allTotal = 0;
              examPo.sumPoint.map((poi: any) => {
                if (poi.studentId == studentRow.studentCode) {
                  total += poi.totalPoint;
                  allTotal += poi.allPoint;
                  const takePoint = (total * item.totalPoint) / (allTotal || 1);
                  studentRow.totalPoint += takePoint;
                }
              });
              studentRow.percentage = +(
                (studentRow.totalPoint / item.totalPoint) *
                100
              ).toFixed(2);
            });
          }
        });
      });
    });
    setTimeout(() => {
      this.tabsReady = true;
      if (this.students && this.tabs.length) {
        this.students.forEach((stu: any) => {
          let totalPoints = 0;
          let totalPercentage = 0;
          let count = 0;

          this.tabs.forEach((tab: any) => {
            const studentRow = tab.content.find(
              (s: any) => s.studentId === stu.id
            );
            if (studentRow) {
              totalPoints += studentRow.totalPoint;
              totalPercentage += studentRow.percentage;
              count++;
            }
          });
          stu.totalPoint = +totalPoints.toFixed(2);
          stu.averagePoint = count ? +(totalPoints / count).toFixed(2) : 0;
          stu.averagePercent = count
            ? +(totalPercentage / count).toFixed(2)
            : 0;
        });
      }
    }, 800);
  }

  getStudentGrade(studentId: string, cloId: string): string {
    const clo = this.tabs.find((t) => t.id === cloId);
    if (!clo) return '-';
    const student = clo.content.find((s: any) => s.studentId === studentId);
    return student?.totalPoint.toFixed(2) || '0';
  }
}
