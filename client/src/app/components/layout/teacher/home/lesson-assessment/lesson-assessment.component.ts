import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AssessProcessService } from './assessProcess';
import { GradeService } from '../../../../../services/gradeService';

@Component({
  selector: 'app-lesson-assessment',
  imports: [TableModule, ButtonModule, CommonModule, AccordionModule],
  templateUrl: './lesson-assessment.component.html',
  styleUrl: './lesson-assessment.component.scss',
})
export class LessonAssessmentComponent {
  tabs: {
    id: string;
    title: string;
    cloPoint: any;
    assessPlan: any;
    totalPoint: number;
    content: any;
    value: number;
  }[] = [];
  @Input() students: any;
  @Input() cloList: any;
  @Input() pointPlan: any;
  @Input() cloPlan: any;
  @Input() lessonId!: string;

  constructor(
    private assessProcess: AssessProcessService,
    private grade: GradeService
  ) {}

  ngOnChanges() {
    if (this.cloList?.length && this.tabs.length === 0) {
      this.tabs = this.cloList.map((item: any, index: number) => ({
        id: item.id,
        title: item.cloName,
        content: [],
        assessPlan: [],
        totalPoint: 0,
        value: index,
      }));
      this.read();
    }
    if (this.pointPlan.plans && this.tabs.length) {
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
              point: 0, // default 0
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
      });

    this.assessProcess
      .studentAttPoint(this.lessonId, this.cloList)
      .subscribe((data) => {});

    this.assessProcess
      .studentExamPointProcess(this.lessonId, this.cloList)
      .subscribe((examQuizPointData) => {
        console.log(examQuizPointData);
        this.tabs.forEach((item: any) => {
          item.content.forEach((studentRow: any) => {
            let total = 0;

            studentRow.points.forEach((pointItem: any) => {
              // const grade = examQuizPointData
              //   .find((g: any) =>
              //     g.sumPoints.find(
              //       (s: any) =>
              //         s.studentId === studentRow.studentCode &&
              //         s.subMethodId === pointItem.subMethodId
              //     )
              //   )
              //   ?.sumPoints.find(
              //     (s: any) =>
              //       s.studentId === studentRow.studentCode &&
              //       s.subMethodId === pointItem.subMethodId
              //   );
              // if (grade) {
              //   pointItem.point = grade.point;
              //   total += grade.point;
              // }
            });

            // studentRow.totalPoint = total;
            // studentRow.percentage = +((total / item.totalPoint) * 100).toFixed(
            //   2
            // );
            // studentRow.letterGrade = this.getLetterGrade(studentRow.percentage);
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

  // read() {
  //   // this.assessProcess
  //   //   .studentAttPoint(this.lessonId, this.cloList)
  //   //   .subscribe((data) => {
  //   //     if (data) {
  //   //       this.tabs.forEach((item: any) => {
  //   //         const match = data.find((stu: any) => item.id === stu.cloId);
  //   //         if (match) {
  //   //           match.sumPoints.forEach((po: any) => {
  //   //             const content = item.content.find(
  //   //               (co: any) => co.studentId === po.studentId
  //   //             );
  //   //             if (content) {
  //   //               content.points.forEach((coPo: any) => {
  //   //                 if (coPo.subMethodId === match.cloId) {
  //   //                   coPo.point = po.statusPoint;
  //   //                 }
  //   //               });
  //   //             }
  //   //           });
  //   //         }
  //   //       });
  //   //     }
  //   //   });
  //   this.assessProcess
  //     .gradePoint(this.lessonId, this.cloList)
  //     .subscribe((gradeData) => {
  //       this.tabs.forEach((item: any) => {
  //         gradeData.forEach((data: any) => {
  //           data.sumPoints.map((stu: any) => {
  //             const content = item.content.find(
  //               (co: any) => co.studentId === stu.studentId
  //             );
  //             if (content) {
  //               const pointItem = content.points.find(
  //                 (coPo: any) => coPo.subMethodId === stu.subMethodId
  //               );
  //               if (pointItem) {
  //                 pointItem.point = stu.point;
  //               }
  //             }
  //           });
  //         });
  //       });
  //       console.log('content:', this.tabs);
  //       console.log('gradeData:', gradeData);
  //     });
  //   // this.grade.getGradeByLesson(this.lessonId).subscribe((gradeData: any) => {
  //   //   if (gradeData) {
  //   //     this.tabs.forEach((item: any) => {
  //   //       gradeData.forEach((data: any) => {
  //   //         data.studentGrades.forEach((stu: any) => {
  //   //           const content = item.content.find(
  //   //             (co: any) => co.studentId === stu.studentId.id
  //   //           );
  //   //           if (content) {
  //   //             stu.grades.forEach((gr: any) => {
  //   //               const pointItem = content.points.find(
  //   //                 (coPo: any) => coPo.subMethodId === gr.id
  //   //               );
  //   //               if (pointItem) {
  //   //                 pointItem.point = gr.point;
  //   //               }
  //   //             });
  //   //           }
  //   //         });
  //   //       });
  //   //     });
  //   //     console.log('content:', this.tabs);
  //   //     console.log('gradeData:', gradeData);
  //   //   }
  //   // });
  // }

  ngOnInit() {}

  trackById(index: number, item: any): string {
    return item.id; // Assuming 'id' is a unique identifier for each tab
  }

  trackByStudentCode(index: number, item: any): string {
    return item.studentCode; // Assuming 'studentCode' is a unique identifier for each student
  }

  getSubMethodName(e: string): string {
    let name = '';
    this.pointPlan.plans.map((pl: any) => {
      pl.subMethods.map((sub: any) => {
        if (sub._id === e) {
          name = sub.subMethod;
        }
      });
    });
    return name;
  }
}
