import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProgressPollService } from '../../../../../services/progressPollService';

@Component({
  selector: 'app-lesson-indirect-assess',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './lesson-indirect-assess.component.html',
  styleUrl: './lesson-indirect-assess.component.scss',
})
export class LessonIndirectAssessComponent {
  @Input() lessonId!: string;
  cloData: any[] = [];
  ratingLevels = [
    { key: 'score5', label: 'Маш сайн (5)' },
    { key: 'score4', label: 'Сайн (4)' },
    { key: 'score3', label: 'Дунд (3)' },
    { key: 'score2', label: 'Муу (2)' },
    { key: 'score1', label: 'Маш муу (1)' },
  ];

  constructor(private service: ProgressPollService) {}

  ngOnInit() {
    this.service
      .getAllLessonStudentsSendPollQues(this.lessonId)
      .subscribe((res) => {
        this.cloData = res;
        this.cloData = this.cloData.filter((item: any) => {
          return item.questionType != 'OTHER';
        });
        console.log(this.cloData);
      });

    this.cloData = [
      {
        clo: 'CLO1',
        responses: { score5: 8, score4: 4, score3: 0, score2: 0, score1: 0 },
        percentages: {
          score5: 66,
          score4: 33,
          score3: 0,
          score2: 0,
          score1: 0,
        },
        total: 12,
        highScoreCount: 12,
        highScorePercent: 100,
      },
      {
        clo: 'CLO2',
        responses: { score5: 9, score4: 3, score3: 0, score2: 0, score1: 0 },
        percentages: {
          score5: 75,
          score4: 25,
          score3: 0,
          score2: 0,
          score1: 0,
        },
        total: 12,
        highScoreCount: 11,
        highScorePercent: 91,
      },
      // Add more CLO entries here...
    ];
  }
}
