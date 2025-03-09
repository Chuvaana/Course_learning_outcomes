import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, RippleModule], // Ensure InputTextModule is here
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.scss'
})
export class LessonListComponent {
  lessonForm: FormGroup;
  isFormVisible = false;
  lessons: { title: string; description: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  addLesson() {
    console.log("fccc");
    // if (this.lessonForm.valid) {
    //   console.log(this.lessonForm);
    //   // this.lessons.push(this.lessonForm.value);
    //   // this.lessonForm.reset(); // Reset form after submission
    //   // this.isFormVisible = false; // Hide form after adding lesson
    // }
  }
}
