import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AttendanceService } from '../../../../../../services/attendanceService';
import { StudentService } from '../../../../../../services/studentService';

interface Student {
  lessonId: string;
  studentCode: string;
  studentName: string;
  lec?: { day?: string; time?: string };
  sem?: { day?: string; time?: string };
  lab?: { day?: string; time?: string };
}

interface Att {
  lessonId: string;
  weekDay: string;
  type: string;
  time: number;
  weekNumber: string;
  attendance: [{ studentId: string; status: boolean }];
}

interface AttendanceRecord {
  student: {
    name: string;
    code: string;
    studentId: string;
  };
  attendance: { [weekNumber: string]: boolean }; // Week number as key, attendance status as value
}
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    CheckboxModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent {
  weekdays: SelectItem[] = [];
  classTypes: SelectItem[] = [];
  selectedWeekday: string = '';
  selectedClassType!: 'lec' | 'sem' | 'lab';
  selectedTimes!: number;
  students: any[] = [];
  attendanceRecords: any[] = [];
  lessonId!: string;
  startDate!: Date;

  times = [
    { value: 1, label: '1-р цаг' },
    { value: 2, label: '2-р цаг' },
    { value: 3, label: '3-р цаг' },
    { value: 4, label: '4-р цаг' },
    { value: 5, label: '5-р цаг' },
    { value: 6, label: '6-р цаг' },
    { value: 7, label: '7-р цаг' },
    { value: 8, label: '8-р цаг' },
  ];
  showPreviousWeeks = false;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private msgService: MessageService
  ) {}

  ngOnInit() {
    this.weekdays = [
      { label: 'Даваа', value: 'Monday' },
      { label: 'Мягмар', value: 'Tuesday' },
      { label: 'Лхагва', value: 'Wednesday' },
      { label: 'Пүрэв', value: 'Thursday' },
      { label: 'Баасан', value: 'Friday' },
    ];
    this.classTypes = [
      { label: 'Лекц', value: 'lec' },
      { label: 'Семинар', value: 'sem' },
      { label: 'Лаборатори', value: 'lab' },
    ];

    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.attendanceService.getConfig('First_day_of_school').subscribe((res) => {
      if (res) {
        this.startDate = new Date(res.itemValue);
      }
    });
  }

  onSelectionChange(): void {
    if (this.selectedWeekday && this.selectedClassType && this.selectedTimes) {
      this.attendanceService
        .getAttendance(
          this.lessonId,
          this.selectedWeekday,
          this.selectedClassType,
          this.selectedTimes
        )
        .subscribe((res: any) => {
          console.log(res);
          this.attendanceRecords = this.generateAttendance(res);
          if (this.attendanceRecords.length == 0) {
            this.studentService
              .getStudentByClasstypeAndDayTime(
                this.selectedClassType,
                this.selectedWeekday,
                this.selectedTimes
              )
              .subscribe((students: any[]) => {
                this.students = students;
                this.attendanceRecords = this.generateAttendanceRecords();
              });
          }
        });
    }
  }

  generateAttendanceRecords() {
    let dates = this.getAllWeeks().sort();
    return this.students.map((student) => ({
      student: {
        name: student.studentName,
        code: student.studentCode,
        studentId: student.id,
      },
      attendance: dates.reduce((acc, date) => ({ ...acc, [date]: false }), {}),
    }));
  }

  generateAttendance(data: any): AttendanceRecord[] {
    const studentAttendanceMap: { [studentId: string]: AttendanceRecord } = {};

    data.forEach((weekData: any) => {
      weekData.attendance.forEach((item: any) => {
        if (!studentAttendanceMap[item.studentId.id]) {
          studentAttendanceMap[item.studentId.id] = {
            student: {
              name: item.studentId.studentName,
              code: item.studentId.studentCode,
              studentId: item.studentId.id,
            },
            attendance: {},
          };
        }

        studentAttendanceMap[item.studentId.id].attendance[
          weekData.weekNumber
        ] = item.status;
      });
    });

    return Object.values(studentAttendanceMap);
  }

  getAllWeeks() {
    let today = new Date();

    let diffInTime = today.getTime() - this.startDate.getTime();
    let diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    let currentWeek = Math.floor(diffInDays / 7) + 1;

    let weeks = [];
    for (let week = 1; week <= currentWeek; week++) {
      weeks.push(this.toRoman(week));
    }

    return weeks;
  }

  toRoman(num: number): string {
    const romanNumerals = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'XI',
      'XII',
      'XIII',
      'XIV',
      'XV',
      'XVI',
    ];
    return romanNumerals[num - 1] || '';
  }

  getCurrentWeeks() {
    let today = new Date();

    let diffInTime = today.getTime() - this.startDate.getTime();
    let diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    let currentWeek = Math.floor(diffInDays / 7) + 1;

    return this.toRoman(currentWeek);
  }

  togglePreviousWeeks() {
    this.showPreviousWeeks = !this.showPreviousWeeks;
  }

  save(): void {
    if (!this.showPreviousWeeks) {
      const currentWeek = this.getCurrentWeeks();
      const lessonId = this.lessonId;
      const attendanceData = {
        lessonId: lessonId,
        weekDay: this.selectedWeekday,
        type: this.selectedClassType,
        time: this.selectedTimes,
        weekNumber: currentWeek,
        attendance: this.attendanceRecords.flatMap((record) =>
          Object.keys(record.attendance)
            .map((date) => {
              if (date === currentWeek) {
                return {
                  studentId: record.student.studentId,
                  status: record.attendance[date],
                };
              }
              return null;
            })
            .filter((item) => item !== null)
        ),
      };

      this.attendanceService.createAttendance(attendanceData).subscribe(
        (response) => {
          console.log('Attendance Saved:', response);
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          });
        },
        (error) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Алдаа гарлаа: ${error.message}`,
          });
        }
      );
    } else {
      const weeks = this.getAllWeeks();
      const lessonId = this.lessonId;
      console.log(weeks);
      const attendanceDatas = weeks.map((item) => {
        return {
          lessonId: lessonId,
          weekDay: this.selectedWeekday,
          type: this.selectedClassType,
          time: this.selectedTimes,
          weekNumber: item,
          attendance: this.attendanceRecords.flatMap((record) =>
            Object.keys(record.attendance)
              .map((date) => {
                if (date === item) {
                  return {
                    studentId: record.student.studentId,
                    status: record.attendance[date],
                  };
                }
                return null;
              })
              .filter((item) => item !== null)
          ),
        };
      });

      this.attendanceService.createAttendanceAll(attendanceDatas).subscribe(
        (response) => {
          console.log('Attendance saved:', response);
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          });
        },
        (error) => {
          console.error('Error saving attendance:', error);
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Алдаа гарлаа: ${error.message}`,
          });
        }
      );
    }
  }
}
