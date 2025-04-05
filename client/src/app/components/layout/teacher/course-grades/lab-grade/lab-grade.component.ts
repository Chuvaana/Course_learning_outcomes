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
import { StudentService } from '../../../../../services/studentService';
import { InputNumberModule } from 'primeng/inputnumber';
import { LabGradeService } from '../../../../../services/labGradeService';

interface GradeRecord {
  student: {
    name: string;
    code: string;
    studentId: string;
  };
  grade1: { [weekNumber: string]: number };
  grade2: { [weekNumber: string]: number };
}

interface GradeRecord1 {
  _id?: string;
  lessonId: string;
  weekDay: string;
  type: 'lec' | 'sem' | 'lab' | '';
  time: number;
  weekNumber: string;
  labGrade: {
    studentId: string;
    grade1: number;
    grade2: number;
  };
}

@Component({
  selector: 'app-lab-grade',
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
    InputNumberModule,
  ],
  providers: [MessageService],
  templateUrl: './lab-grade.component.html',
  styleUrl: './lab-grade.component.scss',
})
export class LabGradeComponent {
  selectedWeekday: string = '';
  selectedClassType!: 'lec' | 'sem' | 'lab';
  selectedTimes!: number;
  students: any[] = [];
  labGradeRecords: GradeRecord[] = [];
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

  weekdays = [
    { label: 'Даваа', value: 'Monday' },
    { label: 'Мягмар', value: 'Tuesday' },
    { label: 'Лхагва', value: 'Wednesday' },
    { label: 'Пүрэв', value: 'Thursday' },
    { label: 'Баасан', value: 'Friday' },
  ];

  classTypes = [
    { label: 'Лекц', value: 'lec' },
    { label: 'Семинар', value: 'sem' },
    { label: 'Лаборатори', value: 'lab' },
  ];

  showPreviousWeeks = false;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private labGradeService: LabGradeService,
    private msgService: MessageService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.labGradeService.getConfig('First_day_of_school').subscribe((res) => {
      if (res) {
        this.startDate = new Date(res.itemValue);
      }
    });
  }

  onSelectionChange(): void {
    if (this.selectedWeekday && this.selectedClassType && this.selectedTimes) {
      this.labGradeService
        .getlabGrade(
          this.lessonId,
          this.selectedWeekday,
          this.selectedClassType,
          this.selectedTimes
        )
        .subscribe((res: any) => {
          console.log(res);
          this.labGradeRecords = this.generateGradeRecords(res);

          if (this.labGradeRecords.length == 0) {
            this.studentService
              .getStudentByClasstypeAndDayTime(
                this.selectedClassType,
                this.selectedWeekday,
                this.selectedTimes
              )
              .subscribe((students: any[]) => {
                this.students = students;
                this.labGradeRecords = this.generateEmptyGradeRecords();
              });
          }
        });
    }
  }

  generateEmptyGradeRecords(): GradeRecord[] {
    const weeks = this.getAllWeeks();
    return this.students.map((student) => ({
      student: {
        name: student.studentName,
        code: student.studentCode,
        studentId: student.id,
      },
      grade1: weeks.reduce((acc, week) => ({ ...acc, [week]: 0 }), {}),
      grade2: weeks.reduce((acc, week) => ({ ...acc, [week]: 0 }), {}),
    }));
  }

  generateGradeRecords(data: any): GradeRecord[] {
    const studentGradeMap: { [studentId: string]: GradeRecord } = {};

    data.forEach((weekData: any) => {
      weekData.labGrade.forEach((item: any) => {
        const sid = item.studentId.id;
        if (!studentGradeMap[sid]) {
          studentGradeMap[sid] = {
            student: {
              name: item.studentId.studentName,
              code: item.studentId.studentCode,
              studentId: sid,
            },
            grade1: {},
            grade2: {},
          };
        }

        studentGradeMap[sid].grade1[weekData.weekNumber] = item.grade1 ?? 0;
        studentGradeMap[sid].grade2[weekData.weekNumber] = item.grade2 ?? 0;
      });
    });

    return Object.values(studentGradeMap);
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
    const lessonId = this.lessonId;

    if (!this.showPreviousWeeks) {
      const currentWeek = this.getCurrentWeeks();
      const gradeData = {
        lessonId: lessonId,
        weekDay: this.selectedWeekday,
        type: this.selectedClassType,
        time: this.selectedTimes,
        weekNumber: currentWeek,
        labGrades: this.labGradeRecords.flatMap((record) => {
          const grade1 = record.grade1[currentWeek] ?? 0;
          const grade2 = record.grade2[currentWeek] ?? 0;

          // Only push if there’s actual data
          if (grade1 !== 0 || grade2 !== 0) {
            return {
              studentId: record.student.studentId,
              grade1: grade1,
              grade2: grade2,
            };
          }
          return [];
        }),
      };

      this.labGradeService.createLabGrade(gradeData).subscribe(
        (response) => {
          console.log('Grades Saved:', response);
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Дүн амжилттай хадгалагдлаа',
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
      const allWeeks = this.getAllWeeks();
      const gradeDatas = allWeeks.map((week) => {
        return {
          lessonId: lessonId,
          weekDay: this.selectedWeekday,
          type: this.selectedClassType,
          time: this.selectedTimes,
          weekNumber: week,
          labGrades: this.labGradeRecords.flatMap((record) => {
            const grade1 = record.grade1[week] ?? 0;
            const grade2 = record.grade2[week] ?? 0;

            if (grade1 !== 0 || grade2 !== 0) {
              return {
                studentId: record.student.studentId,
                grade1: grade1,
                grade2: grade2,
              };
            }
            return [];
          }),
        };
      });

      this.labGradeService.createLabGradeAll(gradeDatas).subscribe(
        (response) => {
          console.log('Grades Saved:', response);
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Дүн амжилттай хадгалагдлаа',
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
    }
  }
}
