import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExamImportComponent } from '../exam/import/exam-import.component';
import { SharedComponent } from '../shared/shared.component';
import { LessonListComponent } from '../teacher/lesson-list/lesson-list.component';
import { LessonComponent } from '../teacher/lesson-list/lesson/lesson.component';
import { TeacherComponent } from '../teacher/teacher.component';
import { AdminComponent } from './admin.component';
import { AdminStudentImportComponent } from './import/student-import.component';
import { PdfComponent } from './pdf-convert/pdf.component';
import { ConfigComponent } from './config/config.component';
import { PloComponent } from './plo/plo.component';
import { VerbComponent } from './verb/verb.component';

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
      },
      {
        path: 'pdf',
        component: PdfComponent,
      },
      {
        path: 'config',
        component: ConfigComponent,
      },
      {
        path: 'plo',
        component: PloComponent,
      },
      {
        path: 'verb',
        component: VerbComponent,
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
    LessonListComponent,
    LessonComponent,
    TeacherComponent,
    SharedComponent
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule]
})
export class AdminModule { }
