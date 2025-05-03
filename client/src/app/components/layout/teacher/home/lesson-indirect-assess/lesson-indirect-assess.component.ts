import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

import { CLOService } from '../../../../../services/cloService';
import { ProgressPollService } from '../../../../../services/progressPollService';

@Component({
  selector: 'app-lesson-indirect-assess',
  standalone: true,
  imports: [TableModule, CommonModule, ChartModule],
  templateUrl: './lesson-indirect-assess.component.html',
  styleUrl: './lesson-indirect-assess.component.scss',
})
export class LessonIndirectAssessComponent {
  @Input() lessonId!: string;
  data: any[] = [];
  cloData: any[] = [];
  cloList: any;
  ratingLevels = [
    { key: 'score5', label: 'Маш сайн (5)' },
    { key: 'score4', label: 'Сайн (4)' },
    { key: 'score3', label: 'Дунд (3)' },
    { key: 'score2', label: 'Муу (2)' },
    { key: 'score1', label: 'Маш муу (1)' },
  ];

  chartData: any;
  chartOptions: any;
  chartData45: any;
  chartOptions45: any;

  constructor(
    private service: ProgressPollService,
    private cloService: CLOService
  ) {}

  ngOnInit() {
    this.cloService.getCloList(this.lessonId).subscribe((res) => {
      this.cloList = res;
    });
    this.service.getPollQuesLesson(this.lessonId).subscribe((res: any) => {
      this.data = res;
      this.cloData = res.flatMap((item: any) =>
        item.groupList
          .filter((qe: any) => qe.groupType === 'CLO')
          .flatMap((qe: any) => qe.questionList || [])
      );

      const stats = this.calculateCloStats(this.cloData);
      this.cloData = stats;
      this.generateChartData(stats);
      this.generateChartData4and5(stats);
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
      const percentages = {
        score5: Math.round((scores.score5 / total) * 100),
        score4: Math.round((scores.score4 / total) * 100),
        score3: Math.round((scores.score3 / total) * 100),
        score2: Math.round((scores.score2 / total) * 100),
        score1: Math.round((scores.score1 / total) * 100),
      };

      return {
        clo: cloId,
        responses: scores,
        percentages,
        total,
        highScoreCount,
        highScorePercent: Math.round((highScoreCount / total) * 100),
      };
    });

    return result;
  }

  generateChartData(stats: any[]) {
    const labels = stats.map((s) => this.getCloName(s.clo));
    const datasets = this.ratingLevels.map((level) => ({
      label: level.label,
      backgroundColor: this.getColorByScore(level.key),
      data: stats.map((s) => s.percentages[level.key]),
    }));

    this.chartData = {
      labels,
      datasets,
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'CLO үнэлгээний түвшний тойм',
        },
      },
    };
  }

  getColorByScore(scoreKey: string): string {
    const colors: any = {
      score5: '#4caf50',
      score4: '#8bc34a',
      score3: '#ffeb3b',
      score2: '#ff9800',
      score1: '#f44336',
    };
    return colors[scoreKey] || '#9e9e9e';
  }
  generateChartData4and5(stats: any[]) {
    const labels = stats.map((s) => this.getCloName(s.clo));

    const dataset = {
      label: 'CLO бүрд харгалзах 4 ба 5 оноо бүхий хариултын эзлэх хувь',
      backgroundColor: '#4caf50',
      data: stats.map((s) => s.highScorePercent),
    };

    this.chartData45 = {
      labels,
      datasets: [dataset],
    };

    this.chartOptions45 = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'CLO-н өндөр үнэлгээний хувь (4 ба 5 оноо)',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value: number) => value + '%',
          },
          title: {
            display: true,
            text: 'Хувь (%)',
          },
        },
      },
    };
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }
}
