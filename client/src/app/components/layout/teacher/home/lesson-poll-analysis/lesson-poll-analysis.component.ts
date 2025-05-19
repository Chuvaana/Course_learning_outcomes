import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProgressPollService } from '../../../../../services/progressPollService';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-lesson-poll-analysis',
  standalone: true,
  imports: [TableModule, CommonModule, DividerModule],
  templateUrl: './lesson-poll-analysis.component.html',
  styleUrl: './lesson-poll-analysis.component.scss',
})
export class LessonPollAnalysisComponent {
  @Input() lessonId!: string;
  data: any[] = [];
  cloData: any[] = [];
  cloList: any;

  studentCount = 0;

  feedbackByGroups: {
    groupName: string;
    questionList: {
      questionTitle: string;
      averageScore: number;
    }[];
  }[] = [];

  otherGroups: any;

  constructor(private service: ProgressPollService) {}

  ngOnInit() {
    this.service.getPollQuesLesson(this.lessonId).subscribe((res: any) => {
      this.data = res;
      this.studentCount = this.data.length;
      this.cloData = res.flatMap((item: any) =>
        item.groupList
          .filter((qe: any) => qe.groupType === 'GENERAL')
          .flatMap((qe: any) => qe.questionList || [])
      );
      this.getData(this.data);
    });
  }

  getData(data: any) {
    const groupMap = new Map<string, Map<string, number[]>>();
    for (const student of data) {
      for (const group of student.groupList) {
        if (group.groupType !== 'CLO' && group.groupType !== 'OTHER') {
          if (!groupMap.has(group.groupName)) {
            groupMap.set(group.groupName, new Map());
          }
          const questionMap = groupMap.get(group.groupName)!;

          for (const question of group.questionList) {
            if (!questionMap.has(question.questionTitle)) {
              questionMap.set(question.questionTitle, []);
            }
            questionMap.get(question.questionTitle)!.push(question.answerValue);
          }
        }
      }
    }
    let groupedAnswers = new Map<
      string,
      { questionTitle: string; answers: string[] }
    >();
    let groupName = '';

    for (const student of data) {
      for (const group of student.groupList) {
        if (group.groupType === 'OTHER') {
          groupName = group.groupName;
          for (const question of group.questionList) {
            if (!groupedAnswers.has(question.questionTitle)) {
              groupedAnswers.set(question.questionTitle, {
                questionTitle: question.questionTitle,
                answers: [],
              });
            }
            // Push student's answer for this question
            groupedAnswers
              .get(question.questionTitle)!
              .answers.push(question.answerValue);
          }
        }
      }
    }

    this.otherGroups = {
      groupName: groupName,
      answers: Array.from(groupedAnswers.values()),
    };

    this.feedbackByGroups = Array.from(groupMap.entries()).map(
      ([groupName, questionMap]) => ({
        groupName,
        questionList: Array.from(questionMap.entries()).map(
          ([questionTitle, values]) => {
            const averageScore = +(
              values.reduce((a, b) => Number(a) + Number(b), 0) / values.length
            ).toFixed(2);
            const count3to5 = values.filter((v) => v >= 3 && v <= 5).length;
            const percentage3to5 = +((count3to5 / values.length) * 100).toFixed(
              1
            );

            return {
              questionTitle,
              averageScore,
              count3to5,
              percentage3to5,
            };
          }
        ),
      })
    );
  }
}
