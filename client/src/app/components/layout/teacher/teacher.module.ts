import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ExamListComponent } from '../exam/exam-list.component';
import { ExamQuestionListComponent } from '../exam/exam-question-list/exam-question-list.component';
import { ExamImportComponent } from '../exam/import/exam-import.component';
import { QuestionListComponent } from '../exam/list/list.component';
import { QuestionComponent } from '../exam/question/question.component';
import { SharedComponent } from '../shared/shared.component';
import { ExamProgressPollComponent } from '../student/exam-progress-poll/exam-progress-poll.component';
import { ActivityComponent } from './activity/activity.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { FinalExamQuestionsComponent } from './final-exam/final-exam.component';
import { HomeComponent } from './home/home.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { AttendanceImportComponent } from './lesson-list/lesson/attendance/attendance-import/attendance-import.component';
import { AttendanceComponent } from './lesson-list/lesson/attendance/attendance.component';
import { CloFreqPlanComponent } from './lesson-list/lesson/clo-freq-plan/clo-freq-plan.component';
import { CloPointPlanComponent } from './lesson-list/lesson/clo-point-plan/clo-point-plan.component';
import { CloTreeComponent } from './lesson-list/lesson/clo-tree/clo-tree.component';
import { LesStudentListComponent } from './lesson-list/lesson/les-student-list/les-student-list.component';
import { LesStudentComponent } from './lesson-list/lesson/les-student/les-student.component';
import { LessonComponent } from './lesson-list/lesson/lesson.component';
import { ProgressPollComponent } from './lesson-list/lesson/progress-poll/progress-poll.component';
import { RegisterGradeComponent } from './register-grade/register-grade.component';
import { TeacherComponent } from './teacher.component';
import { LessonTotalGradeComponent } from './lesson-total-grade/lesson-total-grade.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      { path: 'lessonList', component: LessonListComponent },
      {
        path: 'lesson/:id',
        component: LessonComponent,
        children: [
          { path: 'student', component: LesStudentComponent },
          { path: 'app-active-points', component: LesStudentComponent },
          { path: 'studentList', component: LesStudentListComponent },
          { path: 'clo-tree', component: CloTreeComponent },
          { path: 'clo-freq-plan', component: CloFreqPlanComponent },
          { path: 'clo-point-plan', component: CloPointPlanComponent },
          { path: 'attendance', component: AttendanceComponent },
          { path: 'attendance-import', component: AttendanceImportComponent },
          { path: 'activity', component: ActivityComponent },
          { path: 'curriculum', component: CurriculumComponent },
          { path: 'register-grade', component: RegisterGradeComponent },
          { path: 'exam-import', component: ExamImportComponent },
          { path: 'exam-list', component: ExamListComponent },
          { path: 'exam-progress-poll', component: ExamProgressPollComponent },
          { path: 'progress-poll', component: ProgressPollComponent },
          { path: 'report', component: HomeComponent },
          { path: 'final-exam', component: FinalExamQuestionsComponent },
          { path: 'total-grade', component: LessonTotalGradeComponent },
        ],
      },
      {
        path: 'curriculum/:id',
        component: CurriculumComponent,
      },
      {
        path: 'curriculum',
        component: CurriculumComponent,
      },
      {
        path: 'question-create',
        component: QuestionComponent,
      },
      {
        path: 'questionlist',
        component: QuestionListComponent,
      },
      {
        path: 'exam-questionlist',
        component: ExamQuestionListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LessonListComponent,
    LessonComponent,
    HomeComponent,
    TeacherComponent,
    LessonListComponent,
    LessonComponent,
    LesStudentListComponent,
    LesStudentComponent,
    CloTreeComponent,
    AttendanceComponent,
    CurriculumComponent,
    SharedComponent,
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [],
})
export class TeacherModule {}
