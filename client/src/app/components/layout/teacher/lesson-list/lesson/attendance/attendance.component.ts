import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { StudentService } from '../../../../../../services/studentService';
import { SelectItem } from 'primeng/api';


interface Student {
  lessonId: string;
  studentCode: string;
  studentName: string;
  lec?: { day?: string; time?: string };
  sem?: { day?: string; time?: string };
  lab?: { day?: string; time?: string };
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, TableModule, DropdownModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  weekdays: SelectItem[] = [];
  classTypes: SelectItem[] = [];
  selectedWeekday: string = '';
  selectedClassType: string = '';
  students: any[] = [];
  attendanceRecords: any[] = [];
  lessonId!: string;

  attendanceOptions = [
    { label: 'Тасалсан', value: 'Absent' },
    { label: 'Чөлөөтэй', value: 'Free' },
    { label: 'Ирсэн', value: 'Present' },
    { label: 'Өвчтэй', value: 'Sick' }
  ];
  showPreviousWeeks: boolean = false;

  constructor(private studentService: StudentService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.weekdays = [
      { label: 'Даваа', value: 'Monday' },
      { label: 'Мягмар', value: 'Tuesday' },
      { label: 'Лхагва', value: 'Wednesday' },
      { label: 'Пүрэв', value: 'Thursday' },
      { label: 'Баасан', value: 'Friday' }
    ];
    this.classTypes = [
      { label: 'Лекц', value: 'lec' },
      { label: 'Семинар', value: 'sem' },
      { label: 'Лаборатори', value: 'lab' }
    ];

    this.route.parent?.paramMap.subscribe(params => {
      this.lessonId = params.get('id')!;
    });
  }

  onSelectionChange(): void {
    if (this.selectedWeekday && this.selectedClassType) {
      // Call the service to get students filtered by class type and day
      this.studentService.getStudentByClasstypeAndDay(this.selectedClassType, this.selectedWeekday)
        .subscribe((students: any[]) => {
          this.students = students; // Update the students list
          this.attendanceRecords = this.generateAttendanceRecords();
        });
    }
  } 

  generateAttendanceRecords() {
    let dates = this.getPastThreeDates().sort(); // Sort dates in ascending order
    return this.students.map(student => ({
      student: {name: student.studentName, code: student.studentCode},
      attendance: dates.reduce((acc, date) => ({ ...acc, [date]: '' }), {})
    }));
  }

  getPastThreeDates() {
    let today = new Date();
    let selectedDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.selectedWeekday);
    let dates = [];

    let getClosestPastDate = (referenceDate: Date, targetDayIndex: number) => {
      let date = new Date(referenceDate);
      let dayDiff = (date.getDay() - targetDayIndex + 7) % 7;
      if (dayDiff === 0) {
        return date;
      }
      date.setDate(date.getDate() - dayDiff);
      return date;
    };

    let closestDate = getClosestPastDate(today, selectedDayIndex);
    dates.push(closestDate.toISOString().split('T')[0]);

    for (let i = 1; i < 3; i++) {
      let pastDate = new Date(closestDate);
      pastDate.setDate(pastDate.getDate() - 7 * i);
      dates.push(pastDate.toISOString().split('T')[0]);
    }

    return dates.sort(); // Ensure dates are sorted from oldest to newest
  }

  togglePreviousWeeks() {
    this.showPreviousWeeks = !this.showPreviousWeeks;
  }
}
