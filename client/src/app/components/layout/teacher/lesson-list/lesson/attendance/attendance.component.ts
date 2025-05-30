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
import { SharedDictService } from '../../../shared';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceImportComponent } from './attendance-import/attendance-import.component';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

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
  selectedWeekday: string = 'Monday';
  selectedClassType: 'alec' | 'bsem' | 'clab' = 'alec';
  selectedTimes: number = 1;
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
    private msgService: MessageService,
    private shared: SharedDictService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.weekdays = [
      { label: 'Даваа', value: 'Monday' },
      { label: 'Мягмар', value: 'Tuesday' },
      { label: 'Лхагва', value: 'Wednesday' },
      { label: 'Пүрэв', value: 'Thursday' },
      { label: 'Баасан', value: 'Friday' },
    ];
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.shared.getDictionary(this.lessonId, true).subscribe((res) => {
      this.classTypes = res;

      this.attendanceService
        .getConfig('First_day_of_school')
        .subscribe((res) => {
          if (res) {
            this.startDate = new Date(res.itemValue);
          }
        });

      this.onSelectionChange();
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
          this.attendanceRecords = this.generateAttendance(res);
          if (this.attendanceRecords.length == 0) {
            this.studentService
              .getStudentByClasstypeAndDayTime(
                this.selectedClassType,
                this.selectedWeekday,
                this.selectedTimes,
                this.lessonId
              )
              .subscribe((students: any[]) => {
                this.students = students;
                this.attendanceRecords = this.generateAttendanceRecords();
              });
          }
        });
    } else {
      this.attendanceService
        .getAttendanceByLesson(this.lessonId)
        .subscribe((res) => {
          this.attendanceRecords = this.generateAttendance(res);
          if (this.attendanceRecords.length == 0) {
            this.studentService
              .getStudentByClasstypeAndDayTime(
                this.selectedClassType,
                this.selectedWeekday,
                this.selectedTimes,
                this.lessonId
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

  getAttendanceSum(record: AttendanceRecord): number {
    return Object.values(record.attendance).reduce(
      (sum, val) => sum + (val ? 1 : 0),
      0
    );
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

  importScreen(): void {
    const dialogRef = this.dialog.open(AttendanceImportComponent, {
      width: '60vw',
      height: '50vh',
      maxWidth: 'none',
      data: { lessonId: this.lessonId },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.onSelectionChange();
    });
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.attendanceRecords.map((record, index) => {
        const row: any = {
          '№': index + 1,
          Оюутан: `${record.student.code} - ${record.student.name}`,
        };

        if (this.showPreviousWeeks) {
          this.getAllWeeks().forEach((week) => {
            row[week] = record.attendance[week] ? '✓' : '';
          });
        } else {
          const currentWeek = this.getCurrentWeeks();
          row[currentWeek] = record.attendance[currentWeek] ? '✓' : '';
        }

        row['Нийт'] = this.getAttendanceSum(record);
        return row;
      })
    );

    const workbook: XLSX.WorkBook = {
      Sheets: { Attendance: worksheet },
      SheetNames: ['Attendance'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, 'attendance.xlsx');
  }
}
