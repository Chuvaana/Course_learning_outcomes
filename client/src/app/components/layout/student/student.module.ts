import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExamListComponent } from '../exam/exam-list.component';
import { QuestionTypeListComponent } from '../exam/question-type-list/question-type-list.component';
import { LesStudentComponent } from '../teacher/lesson-list/lesson/les-student/les-student.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { ExamProgressPollComponent } from './exam-progress-poll/exam-progress-poll.component';
import { StudentImportComponent } from './import/student-import.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { StudentComponent } from './student.component';
import { LessonComponent } from './lesson/lesson.component';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,

    children: [
      {
        path: 'lesson-list',
        component: LessonListComponent,
      },
      {
        path: ':id',
        component: LessonComponent,
        children: [
          { path: 'curriculum', component: CurriculumComponent },
          { path: 'plan', component: LessonPlanComponent },
          { path: 'student', component: LesStudentComponent },
          { path: 'exam-progress-poll', component: ExamProgressPollComponent },
          {
            path: 'student-import',
            component: StudentImportComponent,
          },
          {
            path: 'exam-list',
            component: ExamListComponent,
          },
        ],
      },
      { path: 'exam-progress-poll', component: ExamProgressPollComponent },
    ],
  },
  {
    path: 'question-type-list',
    component: QuestionTypeListComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
})
export class StudentModule {}
