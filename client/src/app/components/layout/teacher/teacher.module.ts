import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ExamQuestionListComponent } from '../exam/exam-question-list/exam-question-list.component';
import { ExamImportComponent } from '../exam/import/exam-import.component';
import { QuestionListComponent } from '../exam/list/list.component';
import { QuestionComponent } from '../exam/question/question.component';
import { SharedComponent } from '../shared/shared.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { GradeComponent } from './grade/grade.component';
import { HomeComponent } from './home/home.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { AttendanceComponent } from './lesson-list/lesson/attendance/attendance.component';
import { CloPointPlanComponent } from './lesson-list/lesson/clo-point-plan/clo-point-plan.component';
import { CloTreeComponent } from './lesson-list/lesson/clo-tree/clo-tree.component';
import { LesStudentListComponent } from './lesson-list/lesson/les-student-list/les-student-list.component';
import { LesStudentComponent } from './lesson-list/lesson/les-student/les-student.component';
import { LessonComponent } from './lesson-list/lesson/lesson.component';
import { TeacherComponent } from './teacher.component';
import { ExamListComponent } from '../exam/exam-list.component';
import { ProgressPollComponent } from './lesson-list/lesson/progress-poll/progress-poll.component';
import { ExamProgressPollComponent } from './lesson-list/lesson/progress-poll/exam-progress-poll/exam-progress-poll.component';

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
          { path: 'studentList', component: LesStudentListComponent },
          { path: 'clo-tree', component: CloTreeComponent },
          { path: 'clo-point-plan', component: CloPointPlanComponent },
          { path: 'attendance', component: AttendanceComponent },
          { path: 'curriculum', component: CurriculumComponent },
          { path: 'grade/:planId', component: GradeComponent },
          { path: 'exam-import', component: ExamImportComponent },
          { path: 'exam-list', component: ExamListComponent },
          { path: 'exam-progress-poll', component:ExamProgressPollComponent },
          { path: 'progress-poll', component: ProgressPollComponent },
          { path: 'report', component: HomeComponent },
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
