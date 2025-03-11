import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamListComponent } from '../exam/exam-list.component';
import { ExamImportComponent } from '../exam/import/exam-import.component';
import { StudentImportComponent } from './import/student-import.component';
import { StudentComponent } from './student.component';

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
        path: 'exam-import',
        component: ExamImportComponent,
      },
      {
        path: 'exam-list',
        component: ExamListComponent
      }
    ]
  },

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class StudentModule { }
