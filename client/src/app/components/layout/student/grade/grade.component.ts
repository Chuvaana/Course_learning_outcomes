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
import { AssessmentPlanService } from '../../../../services/assessmentPlanService';
import { GradeService } from '../../../../services/gradeService';
import { StudentService } from '../../../../services/studentService';
import { SharedDictService } from '../../teacher/shared';

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

export interface Lesson {
  _id?: string;
  lessonId: string;
  week: string;
  title: string;
  time: number;
  cloGroups: CloGroup[];
  __v: number;
}

export interface CloGroup {
  cloId: string;
  cloName: string;
  points: {
    id: string;
    name: string;
    point: number;
  }[];
}

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    CheckboxModule,
    InputNumberModule,
  ],
  providers: [MessageService],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
})
export class GradeComponent {
  selectedWeekday = 'Monday';
  selectedTimes = 1;
  selectedType = 'CLAB';
  students: any[] = [];
  gradeRecords: GradeRecord[] = [];
  lessonId!: string;
  title!: string;
  data: any;
  gradeType!: 'BSEM' | 'CLAB' | 'BD';
  gradeTypes: any;
  formData: Lesson[] = [];
  studentCode: any;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private shared: SharedDictService,
    private assessPlan: AssessmentPlanService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.shared.getDictionaryWithBd(this.lessonId, false).subscribe((res) => {
      this.gradeTypes = res;
    });

    this.refreshData();
  }
  refreshData() {
    this.studentCode = localStorage.getItem('studentCode') || null;
    if (this.studentCode) {
      this.studentService
        .getStudentByCode(this.studentCode)
        .subscribe((res) => {
          if (this.selectedType == 'CLAB') {
            this.selectedTimes = res[0].clab.time;
            this.selectedWeekday = res[0].clab.day;
          } else if (this.selectedType == 'BSEM') {
            this.selectedTimes = res[0].bsem.time;
            this.selectedWeekday = res[0].bsem.day;
          } else if (this.selectedType == 'BD') {
            this.selectedTimes = 1;
            this.selectedWeekday = 'Monday';
          }
        });
    }
    this.gradeRecords = [];
    this.formData = [];

    this.assessPlan.getAssessmentPlan(this.lessonId).subscribe((res: any) => {
      this.data = res.filter((item: any) => item.type === this.selectedType);
      const groupedByWeek: { [week: string]: Lesson } = {};

      this.data.forEach((item: any) => {
        if (item.score <= 0) return;

        if (!groupedByWeek[item.week]) {
          groupedByWeek[item.week] = {
            week: item.week,
            lessonId: item.lessonId,
            cloGroups: [],
            __v: item.__v,
            title: '',
            time: 0,
          };
        }

        const lesson = groupedByWeek[item.week];
        let cloGroup = lesson.cloGroups.find(
          (group) => group.cloId === item.clo
        );

        if (!cloGroup) {
          cloGroup = {
            cloId: item.clo,
            cloName: item.cloName,
            points: [],
          };
          lesson.cloGroups.push(cloGroup);
        }

        cloGroup.points.push({
          id: item.method,
          name: item.methodName,
          point: item.score,
        });
      });

      this.formData = Object.values(groupedByWeek).sort(
        (a, b) => this.romanToNumber(a.week) - this.romanToNumber(b.week)
      );
      this.onSelectionChange();
    });
  }
  romanToNumber(roman: string): number {
    const romanMap: { [key: string]: number } = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6,
      VII: 7,
      VIII: 8,
      IX: 9,
      X: 10,
      XI: 11,
      XII: 12,
      XIII: 13,
      XIV: 14,
      XV: 15,
      XVI: 16,
    };
    return romanMap[roman] || 0;
  }

  getMaxTotalScore(): number {
    let total = 0;

    for (const col of this.formData) {
      for (const clo of col.cloGroups) {
        for (const po of clo.points) {
          total += Number(po.point) || 0; // point нь number биш string байвал хөрвүүлнэ
        }
      }
    }

    return total;
  }

  getTotalScore(record: GradeRecord): number {
    return Object.values(record.grades).reduce(
      (sum, val) => sum + (typeof val === 'number' ? val : 0),
      0
    );
  }

  async onSelectionChange(): Promise<void> {
    if (!this.selectedWeekday || !this.selectedTimes) return;
    try {
      const res = await this.gradeService
        .getGrade(
          this.lessonId,
          this.selectedWeekday,
          this.selectedType.toLowerCase(),
          this.selectedTimes
        )
        .toPromise();
      if (res?.length) {
        this.gradeRecords = this.generateGradeRecordsFromResponse(res);
      } else {
        const students = await (this.selectedType === 'BD'
          ? this.studentService.getStudents(this.lessonId).toPromise()
          : this.studentService
              .getStudentByClasstypeAndDayTime(
                this.selectedType.toLowerCase(),
                this.selectedWeekday,
                this.selectedTimes,
                this.lessonId
              )
              .toPromise());

        this.students = students;
        this.gradeRecords = this.generateEmptyGradeRecords();
      }
      this.gradeRecords = this.gradeRecords.filter(
        (item: any) => item.student.code === this.studentCode
      );
    } catch (err) {
      console.error('Error loading lab grades:', err);
    }
  }

  onTypeChange() {
    this.refreshData();
  }

  generateEmptyGradeRecords(): any[] {
    return this.students.map((stu) => {
      const gradeMap: { [pointId: string]: number } = {};

      this.formData.forEach((lesson) => {
        lesson.cloGroups.forEach((group) => {
          group.points.forEach((pt) => {
            const uniqueId = `${lesson.week}_${pt.id}_${group.cloId}`;
            gradeMap[uniqueId] = 0;
          });
        });
      });

      return {
        student: {
          name: stu.studentName,
          code: stu.studentCode,
          studentId: stu.id,
        },
        grades: { ...gradeMap },
      };
    });
  }

  generateGradeRecordsFromResponse(res: any[]): any[] {
    const studentMap: { [studentId: string]: any } = {};

    const allWeekPoints: string[] = [];
    this.formData.forEach((lesson) => {
      lesson.cloGroups.forEach((group) => {
        group.points.forEach((pt) => {
          const uniqueId = `${lesson.week}_${pt.id}_${group.cloId}`;
          allWeekPoints.push(uniqueId);
        });
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
          const key = `${week}_${g.id}_${g.cloId}`;
          studentMap[studentId].grades[key] = g.point;
        });
      });
    });

    return Object.values(studentMap);
  }

  calculateColspan(col: any): number {
    return col.cloGroups.reduce(
      (sum: number, clo: any) => sum + clo.points.length,
      0
    );
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
}
