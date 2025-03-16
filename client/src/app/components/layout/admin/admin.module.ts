import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamListComponent } from '../exam/exam-list.component';
import { ExamImportComponent } from '../exam/import/exam-import.component';
import { TeacherComponent } from '../teacher/teacher.component';
import { SharedComponent } from '../shared/shared.component';
import { AdminStudentImportComponent } from './import/student-import.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LessonListComponent } from '../teacher/lesson-list/lesson-list.component';
import { LessonComponent } from '../teacher/lesson-list/lesson/lesson.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'student-import',
        component: AdminStudentImportComponent,
      },
      {
        path: 'exam-import',
        component: ExamImportComponent,
      }
    ]
  },

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
export class AdminModule { }
