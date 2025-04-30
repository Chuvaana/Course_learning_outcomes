import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { Image } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { forkJoin, map, Observable } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { StudentService } from '../../../../services/studentService';

interface Lesson {
  id: string;
  title: string;
  code: string;
  department: string;
}

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [
    Image,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    RippleModule,
    DropdownModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.scss'],
})
export class LessonListComponent implements OnInit {
  @Input() create = true;
  isFormVisible = false;
  lessons: Lesson[] = [];
  courses: any[] = [];
  course = '';
  branches: any[] = [];
  departments: any[] = [];

  cities: any;

  selectedCity: any;
  selectedYear: any;
  selectedSeason: any;

  yearIntervals: string[] = [];
  selectedInterval: string = '';
  season!: string;
  studentCode!: string;

  constructor(
    private service: StudentService,
    private confService: ConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentCode = localStorage.getItem('studentCode') || '';

    // Load both schoolYear and season in parallel and wait for them
    forkJoin({
      schoolYear: this.confService.getConfig('School_year'),
      season: this.confService.getConfig('season'),
    }).subscribe(({ schoolYear, season }) => {
      if (schoolYear) {
        this.selectedInterval = schoolYear.itemValue;
      }
      if (season) {
        this.selectedSeason = season.itemValue;
        console.log(this.selectedSeason);
      }

      this.readData(
        this.studentCode,
        this.selectedInterval,
        this.selectedSeason
      );
      // Now fetch teacher lessons after both values are set
    });

    this.generateYearIntervals(
      new Date().getFullYear() - 5,
      new Date().getFullYear()
    );
  }

  readData(studentCode: string, year: string, season: string) {
    this.service.getStudentByLessons(studentCode).subscribe((data) => {
      if (data) {
        const courseObservables: Observable<any>[] = data.lessons.map(
          (item: any) => {
            if (item.department) {
              return this.service.getDepartments(item.school).pipe(
                map((departments: any[]) => {
                  const selectedDept = departments.find(
                    (dept) => dept.id === item.department
                  );
                  return {
                    ...item,
                    department: selectedDept
                      ? selectedDept.name
                      : item.department,
                  };
                })
              );
            } else {
              return new Observable((observer) => {
                observer.next(item);
                observer.complete();
              });
            }
          }
        );
        forkJoin(courseObservables).subscribe((updatedCourses: any[]) => {
          this.courses = updatedCourses;
        });
      }
    });
  }

  generateYearIntervals(startYear: number, endYear: number) {
    for (let year = startYear; year < endYear; year++) {
      this.yearIntervals.push(`${year}-${year + 1}`);
    }
    this.selectedInterval = this.yearIntervals[0]; // Default selection
  }

  addLesson() {
    this.router.navigate(['/main/teacher/curriculum']);
  }

  onCourseChange(courseId: string) {
    this.course = courseId;
  }
  onYearChange(event: any) {
    this.courses = [];
    this.readData(this.studentCode, event, this.selectedSeason);
  }
  onSeasonChange(event: any) {
    this.courses = [];
    this.readData(this.studentCode, this.selectedInterval, event);
  }
}
