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
import { AssessmentService } from '../../../../../services/assessmentService';
import { LabGradeService } from '../../../../../services/labGradeService';
import { SemGradeService } from '../../../../../services/semGradeService';
import { StudentService } from '../../../../../services/studentService';

interface GradeRecord {
  student: {
    name: string;
    code: string;
    studentId: string;
  };
  grades: {
    [pointId: string]: number; // key: point.id, value: score
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
  selectedWeekday: string = '';
  selectedClassType = 'sem';
  selectedTimes!: number;
  searchQuery: string = '';
  students: any[] = [];
  labGradeRecords: GradeRecord[] = [];
  lessonId!: string;
  startDate!: Date;
  planId!: string;

  data: any;
  gradeType!: 'SEM' | 'LAB' | 'BDS';

  formData: Lesson[] = [];

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

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private semGradeService: SemGradeService,
    private labGradeService: LabGradeService,
    private msgService: MessageService,
    private service: AssessmentService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.planId = params['planId'];
      this.lessonId = params['id'];
      this.refreshData(); // энэ функцээ параметр солигдох болгонд дуудах
      this.semGradeService.getConfig('First_day_of_school').subscribe((res) => {
        if (res) {
          this.startDate = new Date(res.itemValue);
        }
      });
    });
  }

  refreshData() {
    this.service.getAssessmentByLesson(this.lessonId).subscribe((res: any) => {
      this.data =
        res?.plans?.filter((item: any) => item._id === this.planId) || [];
      this.gradeType = this.data[0].secondMethodType;
      this.data = this.data[0].subMethods;

      this.fetchScheduleData(this.gradeType);
    });
  }

  private fetchScheduleData(type: 'SEM' | 'LAB' | 'BDS') {
    this.selectedClassType = type.toLowerCase();
    const serviceMap = {
      SEM: this.service.getScheduleSems.bind(this.service),
      LAB: this.service.getScheduleLabs.bind(this.service),
      BDS: this.service.getScheduleBds.bind(this.service),
    };

    const fetchService = serviceMap[type];
    if (fetchService) {
      fetchService(this.lessonId).subscribe((res: any[]) => {
        this.formData = res.filter(
          (item: any) =>
            Array.isArray(item.point) && item.point.some((p: any) => p.point)
        );

        console.log(this.formData);
      });
    }
  }

  async onSelectionChange(): Promise<void> {
    if (!this.selectedWeekday || !this.selectedClassType || !this.selectedTimes)
      return;

    try {
      const res = await (this.gradeType === 'SEM'
        ? this.semGradeService
            .getSemGrade(
              this.lessonId,
              this.selectedWeekday,
              this.selectedClassType,
              this.selectedTimes
            )
            .toPromise()
        : this.gradeType === 'LAB'
        ? this.labGradeService
            .getLabGrade(
              this.lessonId,
              this.selectedWeekday,
              this.selectedClassType,
              this.selectedTimes
            )
            .toPromise()
        : this.labGradeService
            .getLabGrade(
              this.lessonId,
              this.selectedWeekday,
              this.selectedClassType,
              this.selectedTimes
            )
            .toPromise());

      if (res?.length) {
        this.labGradeRecords = this.generateGradeRecordsFromResponse(res);
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

  toggleShowEdit() {
    this.showEdit = !this.showEdit;
  }

  clearFilter() {
    this.selectedTimes = 0;
    this.selectedWeekday = '';
    this.searchQuery = '';
    this.labGradeRecords = [];
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

      console.log({
        student: {
          name: stu.studentName,
          code: stu.studentCode,
          studentId: stu.id,
        },
        grades: gradeMap,
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

    // 1. FormData-аар бүх week_point key-үүдийг урьдчилан тодорхойлоход ашиглана
    const allWeekPoints: string[] = [];
    this.formData.forEach((col: any) => {
      col.point.forEach((po: any) => {
        const uniqueId = `${col.week}_${po.id}`;
        allWeekPoints.push(uniqueId);
      });
    });

    // 2. Backend-аас ирсэн бүх record-г гүйлгэнэ
    res.forEach((record) => {
      const week = record.weekNumber;

      record.labGrades.forEach((labGrade: any) => {
        const studentId = labGrade.studentId.id;

        // Хэрвээ тухайн оюутан map-д байхгүй бол шинээр нэм
        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            student: {
              name: labGrade.studentId.studentName,
              code: labGrade.studentId.studentCode,
              studentId: studentId,
            },
            grades: {},
          };

          // Эхлээд бүх point-уудыг 0-оор initialize хийнэ
          allWeekPoints.forEach((wp) => {
            studentMap[studentId].grades[wp] = 0;
          });
        }

        // Энэ week-ийн оноог оруулна
        labGrade.grades.forEach((g: any) => {
          const key = `${week}_${g.id}`;
          studentMap[studentId].grades[key] = g.point;
        });
      });
    });

    // 3. Object map-ийг array болгож буцаана
    return Object.values(studentMap);
  }

  // generateGradeRecords(res: any[]): any[] {
  //   const records: any[] = [];

  //   res.forEach((record) => {
  //     record.labGrades.forEach((labGrade: any) => {
  //       const gradeMap: { [pointId: string]: number } = {};

  //       this.formData.forEach((col: any) => {
  //         col.point.forEach((po: any) => {
  //           const uniqueId = `${record.weekNumber}_${po.id}`;
  //           const found = labGrade.grades.find((g: any) => g.id === po.id);
  //           gradeMap[uniqueId] = found?.point ?? 0;
  //         });
  //       });

  //       records.push({
  //         student: {
  //           name: labGrade.studentId.studentName,
  //           code: labGrade.studentId.studentCode,
  //           studentId: labGrade.studentId.id,
  //         },
  //         grades: gradeMap,
  //       });
  //     });
  //   });
  //   console.log(records);

  //   return records;
  // }

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
    return weekMap[week] || week; // Default to original week string if not mapped
  }

  save(): void {
    const groupedByWeek: { [week: string]: any[] } = {};

    this.labGradeRecords.forEach((record) => {
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
      ([week, labGrades]: [string, any[]]) => ({
        lessonId: this.lessonId,
        weekDay: this.selectedWeekday,
        time: this.selectedTimes,
        weekNumber: this.convertWeekToRoman(week),
        type: this.selectedClassType.toLowerCase(),
        labGrades,
      })
    );

    console.log('Grade Payload:', gradeData);

    if (this.gradeType === 'SEM') {
      this.semGradeService.createSemGradeAll(gradeData).subscribe(
        (res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Оноо хадгалагдлаа',
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
    } else if (this.gradeType === 'LAB') {
      this.labGradeService.createLabGradeAll(gradeData).subscribe(
        (res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Оноо хадгалагдлаа',
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
    } else {
    }

    // const saveService =
    //   this.gradeType === 'SEM'
    //     ? this.semGradeService.createSemGrade
    //     : this.labGradeService.createLabGrade;

    // saveService(gradeData).subscribe({
    //   next: () => {
    //     this.msgService.add({
    //       severity: 'success',
    //       summary: 'Амжилттай',
    //       detail: 'Оноо хадгалагдлаа',
    //     });
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.msgService.add({
    //       severity: 'error',
    //       summary: 'Алдаа',
    //       detail: 'Хадгалах үед алдаа гарлаа',
    //     });
    //   },
    // });
  }
}
