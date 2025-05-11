import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { CloPointPlanService } from '../../../../../services/cloPointPlanService';
import { AssessProcessService } from '../lesson-assessment/assessProcess';

@Component({
  selector: 'app-lesson-overall-assess',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    ProgressSpinnerModule,
    ChartModule,
  ],
  templateUrl: './lesson-overall-assess.component.html',
  styleUrl: './lesson-overall-assess.component.scss',
})
export class LessonOverallAssessComponent {
  @Input() cloList: any;
  @Input() lessonId!: string;
  @Input() pointPlan: any;
  @Input() cloPlan: any;
  @Input() students: any;
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
    private cloPointPlanService: CloPointPlanService
  ) {}

  ngOnInit() {
    this.cloPointPlanService.getPointPlan(this.lessonId).subscribe((res) => {
      if (res.length != 0) {
        res.map((item: any) => {
          let totalPoint = 0;
          item.examPoints.map((exam: any) => {
            totalPoint += exam.point;
          });
          item.procPoints.map((exam: any) => {
            totalPoint += exam.point;
          });
          this.tabs.push({
            id: item.cloId,
            title: this.getCloName(item.cloId),
            totalPoint: totalPoint,
            content: '',
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
        }
        this.readData();
      }
    });
  }

  readData() {
    forkJoin([
      this.assessProcess.gradePoint(this.lessonId),
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
    ]).subscribe(([gradeData, attData, actData]) => {
      this.tabs.forEach((item: any) => {
        gradeData.forEach((grades: any) => {
          if (item.id === grades.cloId) {
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
              studentRow.letterGrade = this.getLetterGrade(
                studentRow.percentage
              );
            });
          }
        });
      });
      this.tabs.forEach((item: any) => {
        attData.forEach((attendance: any) => {
          if (item.id === attendance.cloId) {
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
              studentRow.letterGrade = this.getLetterGrade(
                studentRow.percentage
              );
            });
          }
        });
      });
      this.tabs.forEach((item: any) => {
        actData.forEach((activity: any) => {
          if (item.id === activity.cloId) {
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
              studentRow.letterGrade = this.getLetterGrade(
                studentRow.percentage
              );
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
      this.prepareChartData();
    }, 300);
  }

  prepareChartData() {
    const labels = this.tabs.map((tab) => tab.title);
    const totalStudents = this.tabs.map((tab) => this.getTotalStudents(tab));
    const aboveCCount = this.tabs.map((tab) => this.getAboveCCount(tab));
    const aboveCPercentage = this.tabs.map(
      (tab) => +this.getAboveCPercentage(tab)
    );

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Нийт үнэлэгдсэн оюутны тоо',
          backgroundColor: '#42A5F5',
          data: totalStudents,
        },
        {
          label: 'C ба түүнээс дээш үнэлгээтэй оюутны тоо',
          backgroundColor: '#66BB6A',
          data: aboveCCount,
        },
      ],
    };

    this.percentageChartData = {
      labels: labels,
      datasets: [
        {
          label: 'C ба түүнээс дээш үнэлгээтэй оюутны эзлэх хувь (%)',
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4,
          data: aboveCPercentage,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Оюутны үнэлгээний харьцуулалт',
        },
      },
    };

    this.percentageChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'C ба түүнээс дээш үнэлгээтэй оюутны эзлэх хувь',
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            callback: function (value: number) {
              return value + '%';
            },
          },
        },
      },
    };
  }

  getStudentLetterGrade(studentId: string, cloId: string): string {
    const clo = this.tabs.find((t) => t.id === cloId);
    if (!clo) return '-';
    const student = clo.content.find((s: any) => s.studentId === studentId);
    return student?.letterGrade || '0';
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getLetterGrade(percent: number): string {
    if (percent >= 96) return 'A';
    if (percent >= 91) return 'A-';
    if (percent >= 88) return 'B+';
    if (percent >= 84) return 'B';
    if (percent >= 81) return 'B-';
    if (percent >= 78) return 'C+';
    if (percent >= 74) return 'C';
    if (percent >= 71) return 'C-';
    if (percent >= 68) return 'D+';
    if (percent >= 64) return 'D';
    if (percent >= 60) return 'D-';
    return 'F';
  }
  letterGrades: string[] = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];

  getTotalStudents(tab: any): number {
    return tab.content.filter(
      (s: any) => s.letterGrade && s.letterGrade !== '-'
    ).length;
  }

  getAboveCCount(tab: any): number {
    return tab.content.filter((s: any) =>
      ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'].includes(s.letterGrade)
    ).length;
  }

  getGradeCount(tab: any, grades: string[]): number {
    return tab.content.filter((s: any) => grades.includes(s.letterGrade))
      .length;
  }

  getAboveCPercentage(tab: any): string {
    const total = this.getTotalStudents(tab);
    if (total === 0) return '0.00';
    const aboveC = this.getAboveCCount(tab);
    return ((aboveC / total) * 100).toFixed(2);
  }

  exportPDF() {
    html2canvas(this.chartWrapper.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('charts-summary.pdf');
    });
  }
}
