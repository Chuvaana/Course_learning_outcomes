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
  attendanceOptions = [
    { label: 'Absent', value: 'Absent' },
    { label: 'Free', value: 'Free' },
    { label: 'Present', value: 'Present' },
    { label: 'Sick', value: 'Sick' }
  ];
  showPreviousWeeks: boolean = false;

  constructor() { }

  ngOnInit() {
    this.weekdays = [
      { label: 'Monday', value: 'Monday' },
      { label: 'Tuesday', value: 'Tuesday' },
      { label: 'Wednesday', value: 'Wednesday' },
      { label: 'Thursday', value: 'Thursday' },
      { label: 'Friday', value: 'Friday' }
    ];
    this.classTypes = [
      { label: 'Lecture', value: 'Lecture' },
      { label: 'Seminar', value: 'Seminar' },
      { label: 'Laboratory', value: 'Laboratory' }
    ];
  }

  onSelectionChange() {
    // Fetch students for the selected class type and weekday
    this.students = this.getStudents();
    this.attendanceRecords = this.generateAttendanceRecords();
  }

  getStudents() {
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];
  }

  generateAttendanceRecords() {
    let dates = this.getPastThreeDates().sort(); // Sort dates in ascending order
    return this.students.map(student => ({
      student,
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
