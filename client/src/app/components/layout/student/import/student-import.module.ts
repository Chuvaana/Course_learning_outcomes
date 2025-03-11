import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentImpoirtCompnent } from './student-import.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: StudentImpoirtCompnent,
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
export class StudentImportModule { }
