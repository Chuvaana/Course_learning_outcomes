import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProgressPollService } from '../../../../../services/progressPollService';
import { CLOService } from '../../../../../services/cloService';
import { AssessProcessService } from '../lesson-assessment/assessProcess';
import { forkJoin } from 'rxjs';
import { CloPointPlanService } from '../../../../../services/cloPointPlanService';

@Component({
  selector: 'app-lesson-direct-indirect',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './lesson-direct-indirect.component.html',
  styleUrl: './lesson-direct-indirect.component.scss',
})
export class LessonDirectIndirectComponent {
  @Input() lessonId!: string;
  @Input() pointPlan: any;
  @Input() cloPlan: any;
  @Input() students: any;
  @Input() cloList: any;
  cloListObj: any[] = [];
  cloList1: any[] = [];
  data: any[] = [];
  cloData: any[] = [];
  summaryData: any[] = [];
  tabs: {
    id: string;
    title: string;
    totalPoint: number;
    content: any;
  }[] = [];

  averagePercentages: any;

  constructor(
    private service: ProgressPollService,
    private assessProcess: AssessProcessService,
    private cloPointPlanService: CloPointPlanService,
    private cloService: CLOService
  ) {}

  ngOnInit() {
    this.cloService.getCloList(this.lessonId).subscribe((res) => {
      this.cloListObj = res;
      res.map((clo: any) => {
        this.cloList1.push(clo.id);
      });
    });
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
    this.service.getPollQuesLesson(this.lessonId).subscribe((res: any) => {
      this.data = res;
      this.cloData = res.flatMap((item: any) =>
        item.groupList
          .filter((qe: any) => qe.groupType === 'CLO')
          .flatMap((qe: any) => qe.questionList || [])
      );

      const stats = this.calculateCloStats(this.cloData);

      const percentValues: { [key: string]: number } = {};
      const gradeValues: { [key: string]: string } = {};

      stats.forEach((item) => {
        percentValues[item.clo] = item.highScorePercent;
        gradeValues[item.clo] = item.letter;
      });

      this.summaryData = [
        {
          label: 'Шууд бус үнэлгээний дундаж хувь',
          values: percentValues,
          type: 'percent',
        },
        {
          label: 'Шалгуур хангасан байдал',
          values: gradeValues,
          type: 'grade',
        },
      ];
    });
  }

  calculateCloStats(data: any[]) {
    const grouped: { [cloId: string]: any[] } = {};

    data.forEach((entry) => {
      if (!grouped[entry.cloId]) grouped[entry.cloId] = [];
      grouped[entry.cloId].push(entry);
    });

    const result = Object.entries(grouped).map(([cloId, responses]) => {
      const scores = { score5: 0, score4: 0, score3: 0, score2: 0, score1: 0 };
      let highScoreCount = 0;

      responses.forEach((entry: any) => {
        const value = Number(entry.answerValue);
        if (value >= 1 && value <= 5) {
          scores[`score${value}` as keyof typeof scores]++;
          if (value >= 4) highScoreCount++;
        }
      });

      const total = responses.length;

      return {
        clo: cloId,
        highScorePercent: Math.round((highScoreCount / total) * 100),
        letter: this.getLetterGrade(Math.round((highScoreCount / total) * 100)),
      };
    });

    return result;
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
      this.assessProcess.studentExamPointProcess(this.lessonId, this.cloList),
    ]).subscribe(([gradeData, attData, actData, examData]) => {
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
      const assessPlanMap = new Map();
      this.cloPlan.forEach((plan: any) => {
        const assessPlan = [...plan.examPoints, ...plan.procPoints].filter(
          (ePoint) => ePoint.point !== 0
        );
        assessPlanMap.set(plan.cloId, assessPlan);
      });
      this.tabs.forEach((item: any) => {
        examData.forEach((examPo: any) => {
          if (item.id === examPo.cloId) {
            const list = assessPlanMap.get(examPo.cloId);
            item.content.forEach((studentRow: any) => {
              let total = 0;
              let allTotal = 0;
              examPo.sumPoint.map((poi: any) => {
                if (poi.studentId == studentRow.studentCode) {
                  const listPoint = list.find(
                    (li: any) => li.subMethodId === poi.subMethodId
                  );
                  const point = listPoint ? listPoint.point : 0;
                  total += poi.totalPoint;
                  allTotal += poi.allPoint;
                  const takePoint = (total * point) / (allTotal || 1);
                  studentRow.totalPoint += takePoint;
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
      this.averagePercentages = this.getCloAveragePercentages();

      const percentValues: { [key: string]: number } = {};
      const gradeValues: { [key: string]: string } = {};

      this.averagePercentages.forEach((item: any) => {
        percentValues[item.clo] = item.percentage;
        gradeValues[item.clo] = item.letter;
      });
      this.summaryData.push(
        {
          label: 'Шууд үнэлгээний дундаж хувь',
          values: percentValues,
          type: 'percent',
        },
        {
          label: 'Шалгуур хангасан байдал',
          values: gradeValues,
          type: 'grade',
        }
      );
    }, 800);
  }

  getCloAveragePercentages(): {
    clo: string;
    percentage: number;
    letter: string;
  }[] {
    return this.tabs.map((tab) => {
      const students = tab.content || [];
      const totalPercent = students.reduce((sum: number, student: any) => {
        return sum + (student.percentage || 0);
      }, 0);
      const average = students.length ? totalPercent / students.length : 0;
      const rounded = +average.toFixed(2);
      return {
        clo: tab.id,
        percentage: rounded,
        letter: this.getLetterGrade(rounded),
      };
    });
  }

  getLetterGrade(percent: number): string {
    if (percent > 90) return 'A';
    if (percent > 80) return 'B';
    if (percent > 70) return 'C';
    if (percent > 60) return 'D';
    return 'F';
  }

  getCloName(cloId: string): string {
    const clo = this.cloListObj.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getCellStyle(value: number | string, type: string) {
    if (type === 'grade') {
      return {
        'background-color':
          value === 'A' ? '#a5d6a7' : value !== 'A' ? '#fff59d' : '',
        'text-align': 'center',
      };
    }
    return {};
  }
}
