import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TeacherService } from '../../../../services/teacherService';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';

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
  isFormVisible = false;
  lessons: Lesson[] = [];
  courses: any[] = [];
  course = '';
  branches: any[] = [];
  departments: any[] = [];

  constructor(private fb: FormBuilder, private service: TeacherService, private router: Router) { }

  ngOnInit(): void {
    const teacherId = localStorage.getItem("teacherId") || '';
    this.service.getTeacherLessons(teacherId).subscribe((data)=>{
      if (data) {
        // this.courses = data.lessons;
        const courseObservables: Observable<any>[] = data.lessons.map((item: any) => {
          if (item.department) {
            return this.service.getDepartments(item.school).pipe(
              map((departments: any[]) => {
                const selectedDept = departments.find(dept => dept.id === item.department);
                return {
                  ...item,
                  department: selectedDept ? selectedDept.name : item.department
                };
              })
            );
          } else {
            return new Observable(observer => {
              observer.next(item);
              observer.complete();
            });
          }
        });

        forkJoin(courseObservables).subscribe((updatedCourses: any[]) => {
          this.courses = updatedCourses;
        });
      }
    })
  }

  addLesson() {
    this.router.navigate(['/main/teacher/curriculum'])
  }

  onCourseChange(courseId: string) {
    this.course = courseId;
  }
}
