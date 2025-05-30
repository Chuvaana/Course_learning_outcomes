import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as FileSaver from 'file-saver';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import { PdfLessonAssessmentService } from '../../../../../services/pdf-lesson-assessment.service';
import { AssessProcessService } from './assessProcess';

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
  @Input() teacherName!: string;

  constructor(
    private assessProcess: AssessProcessService,
    private servicePdfLessAss: PdfLessonAssessmentService
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
        this.pointPlan,
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
      .studentActivityPoint(this.lessonId, this.pointPlan, this.cloPlan)
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
                      g.studentId.toLowerCase() ===
                        studentRow.studentCode.toLowerCase() &&
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
      });
  }

  getLetterGrade(percent: number): string {
    if (percent > 90) return 'A';
    if (percent > 80) return 'B';
    if (percent > 70) return 'C';
    if (percent > 60) return 'D';
    return 'F';
  }

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
  excelConvert(data: any): void {
    const convertData: any[] = [];
    data.content.forEach((row: any, index: number) => {
      const excelRow: any = {
        '№': index + 1,
        'Оюутны нэр': row.studentName,
      };

      data.assessPlan.forEach((plan: any, i: number) => {
        const point = row.points[i]?.point;
        excelRow[plan.subMethodName] = point != null ? point.toFixed(2) : '-';
      });

      excelRow['Нийт оноо'] =
        row.totalPoint != null ? row.totalPoint.toFixed(2) : '-';
      excelRow['100%-д шилжүүлсэн оноо'] =
        row.percentage != null ? row.percentage.toFixed(2) + '%' : '-';
      excelRow['Үсгэн үнэлгээ'] = row.letterGrade;

      convertData.push(excelRow);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(convertData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, data.title);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, fileName + new Date().getTime() + '.xlsx');
  }

  pdfConvert(e: any): void {
    console.log(e);
    this.servicePdfLessAss.generatePdf(e, this.teacherName);
  }
  pdfConvertAll(e: any): void {
    console.log(e);
    this.servicePdfLessAss.generatePdfAll(e, this.teacherName);
  }
}
