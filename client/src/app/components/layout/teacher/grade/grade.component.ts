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
import { AssessmentService } from '../../../../services/assessmentService';
import { GradeService } from '../../../../services/gradeService';
import { StudentService } from '../../../../services/studentService';

interface GradeRecord {
  student: {
    name: string;
    code: string;
    studentId: string;
  };
  grades: {
    [pointId: string]: number;
  };
}

export interface CloRelevance {
  cloName: string;
  id: string;
}

export interface Lesson {
  _id: string;
  lessonId: string;
  week: string;
  title: string;
  time: number;
  cloRelevance: CloRelevance;
  point: [
    {
      id: string;
      point: number;
    }
  ];
  __v: number;
}

@Component({
  selector: 'app-bd-grade',
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
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
})
export class GradeComponent {
  selectedWeekday = 'Monday';
  selectedTimes = 1;
  searchQuery: string = '';
  students: any[] = [];
  gradeRecords: GradeRecord[] = [];
  lessonId!: string;
  startDate!: Date;
  planId!: string;
  title!: string;
  data: any;
  gradeType!: 'BSEM' | 'CLAB' | 'BD';
  formData: Lesson[] = [];
  showEdit = false;

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

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private msgService: MessageService,
    private service: AssessmentService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.route.params.subscribe((params) => {
      this.planId = params['planId'];
      this.refreshData();
      this.gradeService.getConfig('First_day_of_school').subscribe((res) => {
        if (res) {
          this.startDate = new Date(res.itemValue);
        }
      });
    });
  }

  refreshData() {
    this.gradeRecords = [];
    this.service.getAssessmentByLesson(this.lessonId).subscribe((res: any) => {
      this.data =
        res?.plans?.filter((item: any) => item._id === this.planId) || [];
      this.title = this.data[0].methodName;
      this.gradeType = this.data[0].secondMethodType;
      this.data = this.data[0].subMethods;

      this.fetchScheduleData(this.gradeType);
      this.onSelectionChange();
    });
  }

  private fetchScheduleData(type: 'BSEM' | 'CLAB' | 'BD') {
    const serviceMap = {
      BSEM: this.service.getScheduleSems.bind(this.service),
      CLAB: this.service.getScheduleLabs.bind(this.service),
      BD: this.service.getScheduleBds.bind(this.service),
    };

    const fetchService = serviceMap[type];
    if (fetchService) {
      fetchService(this.lessonId).subscribe((res: any[]) => {
        this.formData = res.filter(
          (item: any) =>
            Array.isArray(item.point) && item.point.some((p: any) => p.point)
        );
      });
    }
  }

  async onSelectionChange(): Promise<void> {
    if (!this.selectedWeekday || !this.selectedTimes) return;
    try {
      const res = await this.gradeService
        .getGrade(
          this.lessonId,
          this.selectedWeekday,
          this.gradeType.toLowerCase(),
          this.selectedTimes
        )
        .toPromise();
      if (res?.length) {
        this.gradeRecords = this.generateGradeRecordsFromResponse(res);
      } else {
        const students = await (this.gradeType === 'BD'
          ? this.studentService.getStudents(this.lessonId).toPromise()
          : this.studentService
              .getStudentByClasstypeAndDayTime(
                this.gradeType.toLowerCase(),
                this.selectedWeekday,
                this.selectedTimes
              )
              .toPromise());

        this.students = students;
        this.gradeRecords = this.generateEmptyGradeRecords();
      }

      this.applySearchFilter();
    } catch (err) {
      console.error('Error loading lab grades:', err);
    }
  }

  applySearchFilter(): void {
    if (!this.searchQuery) return;

    const query = this.searchQuery.toLowerCase();
    this.gradeRecords = this.gradeRecords.filter(
      (item) =>
        item.student.name.toLowerCase().includes(query) ||
        item.student.code.toLowerCase().includes(query)
    );
  }

  toggleShowEdit() {
    this.showEdit = !this.showEdit;
  }

  clearFilter() {
    this.selectedTimes = 0;
    this.selectedWeekday = '';
    this.searchQuery = '';
    this.gradeRecords = [];
  }

  generateEmptyGradeRecords(): any[] {
    return this.students.map((stu) => {
      const gradeMap: { [pointId: string]: number } = {};

      this.formData.forEach((col) => {
        col.point.forEach((po) => {
          const uniqueId = `${col.week}_${po.id}`;
          gradeMap[uniqueId] = 0;
        });
      });

      return {
        student: {
          name: stu.studentName,
          code: stu.studentCode,
          studentId: stu.id,
        },
        grades: gradeMap,
      };
    });
  }

  generateGradeRecordsFromResponse(res: any[]): any[] {
    const studentMap: { [studentId: string]: any } = {};

    const allWeekPoints: string[] = [];
    this.formData.forEach((col: any) => {
      col.point.forEach((po: any) => {
        const uniqueId = `${col.week}_${po.id}`;
        allWeekPoints.push(uniqueId);
      });
    });

    res.forEach((record) => {
      const week = record.weekNumber;

      record.studentGrades.forEach((grade: any) => {
        const studentId = grade.studentId.id;

        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            student: {
              name: grade.studentId.studentName,
              code: grade.studentId.studentCode,
              studentId: studentId,
            },
            grades: {},
          };

          allWeekPoints.forEach((wp) => {
            studentMap[studentId].grades[wp] = 0;
          });
        }

        grade.grades.forEach((g: any) => {
          const key = `${week}_${g.id}`;
          studentMap[studentId].grades[key] = g.point;
        });
      });
    });

    return Object.values(studentMap);
  }

  getWeekNumberForRecord(record: GradeRecord): string {
    const lesson = this.formData.find((lesson) =>
      lesson.point.some(
        (point) => record.grades[`${lesson.week}_${point.id}`] !== undefined
      )
    );
    return lesson ? this.convertWeekToRoman(lesson.week) : 'Unknown';
  }

  convertWeekToRoman(week: string): string {
    const weekMap: { [key: string]: string } = {
      '1': 'I',
      '2': 'II',
      '3': 'III',
      '4': 'IV',
      '5': 'V',
      '6': 'VI',
      '7': 'VII',
      '8': 'VIII',
      '9': 'IX',
      '10': 'X',
      '11': 'XI',
      '12': 'XII',
      '13': 'XIII',
      '14': 'XIV',
      '15': 'XV',
      '16': 'XVI',
    };
    return weekMap[week] || week;
  }

  save(): void {
    const groupedByWeek: { [week: string]: any[] } = {};

    this.gradeRecords.forEach((record) => {
      this.formData.forEach((lesson) => {
        const week = lesson.week;
        if (!groupedByWeek[week]) groupedByWeek[week] = [];

        const studentGrades = lesson.point.map((pt) => ({
          point: record.grades[`${lesson.week}_${pt.id}`] ?? 0,
          id: pt.id,
        }));

        groupedByWeek[week].push({
          studentId: record.student.studentId,
          grades: studentGrades,
        });
      });
    });

    const gradeData = Object.entries(groupedByWeek).map(
      ([week, studentGrades]: [string, any[]]) => ({
        lessonId: this.lessonId,
        weekDay: this.selectedWeekday,
        time: this.selectedTimes,
        weekNumber: this.convertWeekToRoman(week),
        type: this.gradeType.toLowerCase(),
        studentGrades,
      })
    );

    console.log('Grade Payload:', gradeData);

    this.gradeService.createGradeAll(gradeData).subscribe(
      (res) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Оноо амжилттай хадгалагдлаа',
        });
        if (this.showEdit) {
          this.toggleShowEdit();
        }
      },
      (err) => {
        console.error(err);
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Хадгалах үед алдаа гарлаа',
        });
      }
    );
  }
}
