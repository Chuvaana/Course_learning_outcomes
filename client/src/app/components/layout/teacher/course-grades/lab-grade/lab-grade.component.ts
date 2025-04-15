import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LabGradeService } from '../../../../../services/labGradeService';
import { StudentService } from '../../../../../services/studentService';
import { AssessmentService } from '../../../../../services/assessmentService';

interface GradeRecord {
  student: {
    name: string;
    code: string;
    studentId: string;
  };
  grade1: { [weekNumber: string]: number };
  grade2: { [weekNumber: string]: number };
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
  selectedClassType = 'lab';
  selectedTimes!: number;
  searchQuery: string = '';
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

  showPreviousWeeks = false;
  showEdit = false;

  subMethods = [];

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private labGradeService: LabGradeService,
    private msgService: MessageService,
    private assessService: AssessmentService
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

    // this.assessService.getAssessmentByLesson(this.lessonId).subscribe((res) => {
    //   this.subMethods = res
    // })
  }

  async onSelectionChange(): Promise<void> {
    if (!this.selectedWeekday || !this.selectedClassType || !this.selectedTimes)
      return;

    try {
      const res = await this.labGradeService
        .getlabGrade(
          this.lessonId,
          this.selectedWeekday,
          this.selectedClassType,
          this.selectedTimes
        )
        .toPromise();

      if (res?.length) {
        this.labGradeRecords = this.generateGradeRecords(res);
      } else {
        const students = await this.studentService
          .getStudentByClasstypeAndDayTime(
            this.selectedClassType,
            this.selectedWeekday,
            this.selectedTimes
          )
          .toPromise();

        this.students = students;
        this.labGradeRecords = this.generateEmptyGradeRecords();
      }

      this.applySearchFilter();
    } catch (err) {
      console.error('Error loading lab grades:', err);
    }
  }

  applySearchFilter(): void {
    if (!this.searchQuery) return;

    const query = this.searchQuery.toLowerCase();
    this.labGradeRecords = this.labGradeRecords.filter(
      (item) =>
        item.student.name.toLowerCase().includes(query) ||
        item.student.code.toLowerCase().includes(query)
    );
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

  toggleShowEdit() {
    this.showEdit = !this.showEdit;
  }

  clearFilter() {
    this.selectedTimes = 0;
    this.selectedWeekday = '';
    this.searchQuery = '';
    this.labGradeRecords = [];
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

          return {
            studentId: record.student.studentId,
            grade1: grade1,
            grade2: grade2,
          };
        }),
      };

      this.labGradeService.createLabGrade(gradeData).subscribe(
        (response) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Дүн амжилттай хадгалагдлаа',
          });
          if (this.showEdit) {
            this.toggleShowEdit();
          }
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

            return {
              studentId: record.student.studentId,
              grade1: grade1,
              grade2: grade2,
            };
          }),
        };
      });

      this.labGradeService.createLabGradeAll(gradeDatas).subscribe(
        (response) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Дүн амжилттай хадгалагдлаа',
          });
          if (this.showEdit) {
            this.toggleShowEdit();
          }
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
