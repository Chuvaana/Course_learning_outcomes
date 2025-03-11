import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamListComponent } from './exam-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: ExamListComponent,
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
export class ExamListModule { }
