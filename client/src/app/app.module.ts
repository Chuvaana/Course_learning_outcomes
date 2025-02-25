import { NgModule } from '@angular/core';
import { TeacherService } from './services/teacherService';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, ButtonModule
  ],
  exports: [
    CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, ButtonModule
  ],
  providers: [
    TeacherService
  ]
})
export class AppModule { }
