import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LessonComponent } from './lesson/lesson.component';
import { LesStudentComponent } from './lesson/les-student/les-student.component';

const routes: Routes = [
  {
    path: '',
    component: LessonComponent,
    children: [
      {
        path: 'clo',
        component: LessonComponent
      },
      {
        path: 'student',
        component: LesStudentComponent
      }
    ]
  }

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule
  ],
  exports: [
    RouterModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class LessonModule { }
