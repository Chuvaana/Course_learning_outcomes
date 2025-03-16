import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamListComponent } from '../exam/exam-list.component';
import { ExamImportComponent } from '../exam/import/exam-import.component';
import { StudentImportComponent } from './import/student-import.component';
import { StudentComponent } from './student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LessonListComponent } from '../teacher/lesson-list/lesson-list.component';
import { LessonComponent } from '../teacher/lesson-list/lesson/lesson.component';
import { TeacherComponent } from '../teacher/teacher.component';
import { SharedComponent } from '../shared/shared.component';
import { ListComponent } from '../exam/list/list.component';
import { QuestionTypeListComponent } from '../exam/question-type-list/question-type-list.component';
import { QuestionComponent } from '../exam/question/question.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'student-import',
        component: StudentImportComponent,
      },
      {
        path: 'exam',
        component: ListComponent,
      },
      {
        path: 'exam-list',
        component: ExamListComponent
      },
      {
        path: 'question',
        component: QuestionComponent,
      }
    ]
  },
  {
    path: 'question-type-list',
    component: QuestionTypeListComponent,
  }

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LessonListComponent, // ✅ Explicitly importing standalone components
    LessonComponent,
    TeacherComponent,
    SharedComponent
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule]
})
export class StudentModule { }
