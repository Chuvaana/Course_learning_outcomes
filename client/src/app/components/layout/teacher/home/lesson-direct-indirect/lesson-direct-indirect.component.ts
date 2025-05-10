import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProgressPollService } from '../../../../../services/progressPollService';
import { CLOService } from '../../../../../services/cloService';

@Component({
  selector: 'app-lesson-direct-indirect',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './lesson-direct-indirect.component.html',
  styleUrl: './lesson-direct-indirect.component.scss',
})
export class LessonDirectIndirectComponent {
  @Input() lessonId!: string;
  cloListObj: any[] = [];
  cloList: any[] = [];
  data: any[] = [];
  cloData: any[] = [];
  summaryData: any[] = [];

  // cloList = ['CLO-1', 'CLO-2', 'CLO-3', 'CLO-4', 'CLO-5', 'CLO-6', 'CLO-7'];

  constructor(
    private service: ProgressPollService,
    private cloService: CLOService
  ) {}

  ngOnInit() {
    this.cloService.getCloList(this.lessonId).subscribe((res) => {
      this.cloListObj = res;
      res.map((clo: any) => {
        this.cloList.push(clo.id);
      });
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

      // Final summaryData array
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

    // Group by cloId
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
    // if (type === 'percent') {
    //   return {
    //     'background-color':
    //       typeof value === 'number' && value >= 85 ? '#a5d6a7' : '#fff59d',
    //     'text-align': 'center',
    //   };
    // } else
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
