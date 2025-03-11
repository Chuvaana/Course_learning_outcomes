import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TeacherService } from '../../../../services/teacherService';
import { RouterModule } from '@angular/router';

interface Lesson {
  id: string;
  title: string;
  code: string;
  department: string;
}

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, RippleModule, DropdownModule, RouterModule, ReactiveFormsModule],
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.scss']
})
export class LessonListComponent implements OnInit {
  lessonForm: FormGroup;
  isFormVisible = false;
  lessons: Lesson[] = [];
  courses = [];
  course = '';

  constructor(private fb: FormBuilder, private service: TeacherService) {
    this.lessonForm = this.fb.group({
      course: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.service.getLessons().subscribe((data) => {
      if (data) {
        this.courses = data;
      }
    });

    this.service.getTeacher().subscribe((res) => {
      if (res && res.lessons) {
        this.lessons = res.lessons.map((lesson: any) => ({
          ...lesson,
          id: lesson._id
        }));
        console.log(this.lessons);
      }
    });
    
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  onCourseChange(courseId: string) {
    this.course = courseId;
  }

  addLesson() {
    if (this.course) {
      this.service.assignLesson(this.course).subscribe((data) => {
        if (data && data.message === 'success') {
          this.service.getTeacher().subscribe((res) => {
            if (res) {
              this.lessons = res.teacher.lessons;
            }
          })
        }
      },
        (error) => {
          let errorMessage = 'Хичээл нэмэхэд алдаа гарлаа';

          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          alert(errorMessage);
          console.error('Алдаа:', error);
        });
      // Reset form and hide after adding the lesson
      this.lessonForm.reset();
      this.isFormVisible = false;
    }
  }
}
