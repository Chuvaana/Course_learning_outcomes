import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ActivityService } from '../../../../services/activityService';
import { StudentService } from '../../../../services/studentService';
import { AssessmentService } from '../../../../services/assessmentService';
import { map } from 'rxjs';
interface ActivityRecord {
  student: {
    name: string;
    code: string;
    studentId: string;
  };
  activity: { [weekNumber: string]: number }; // Week number as key, activity status as value
}

@Component({
  selector: 'app-activity',
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
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent {
  weekdays: SelectItem[] = [];
  classTypes: SelectItem[] = [];
  selectedWeekday: string = 'Monday';
  selectedClassType: 'alec' | 'bsem' | 'clab' = 'alec';
  selectedTimes: number = 1;
  students: any[] = [];
  activityRecords: any[] = [];
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
  activityPoint = 0;

  constructor(
    private studentService: StudentService,
    private assessService: AssessmentService,
    private route: ActivatedRoute,
    private activityService: ActivityService,
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
      { label: 'Лекц', value: 'alec' },
      { label: 'Семинар', value: 'bsem' },
      { label: 'Лаборатори', value: 'clab' },
    ];

    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.activityService.getConfig('First_day_of_school').subscribe((res) => {
      if (res) {
        this.startDate = new Date(res.itemValue);
      }
    });

    this.assessService
      .getAssessmentByLesson(this.lessonId)
      .subscribe((res: any) => {
        console.log(res);
        res.plans.map((item: any) => {
          if (item.methodType === 'PARTI') {
            if (item.subMethods.length != 0) {
              item.subMethods.map((po: any) => {
                this.activityPoint = po.point;
                console.log(this.activityPoint);
              });
            }
          }
        });
      });
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    if (this.selectedWeekday && this.selectedClassType && this.selectedTimes) {
      this.activityService
        .getActivity(
          this.lessonId,
          this.selectedWeekday,
          this.selectedClassType,
          this.selectedTimes
        )
        .subscribe((res: any) => {
          this.activityRecords = this.generateActivity(res);
          if (this.activityRecords.length == 0) {
            this.studentService
              .getStudentByClasstypeAndDayTime(
                this.selectedClassType,
                this.selectedWeekday,
                this.selectedTimes
              )
              .subscribe((students: any[]) => {
                this.students = students;
                this.activityRecords = this.generateActivityRecords();
              });
          }
        });
    } else {
      this.activityService
        .getActivityByLesson(this.lessonId)
        .subscribe((res: any) => {
          console.log(res);
          this.activityRecords = this.generateActivity(res);
          if (this.activityRecords.length == 0) {
            this.studentService
              .getStudentByClasstypeAndDayTime(
                this.selectedClassType,
                this.selectedWeekday,
                this.selectedTimes
              )
              .subscribe((students: any[]) => {
                this.students = students;
                this.activityRecords = this.generateActivityRecords();
              });
          }
        });
    }
  }

  generateActivityRecords() {
    let dates = this.getAllWeeks().sort();
    return this.students.map((student) => ({
      student: {
        name: student.studentName,
        code: student.studentCode,
        studentId: student.id,
      },
      activity: dates.reduce((acc, date) => ({ ...acc, [date]: 0 }), {}),
    }));
  }

  generateActivity(data: any): ActivityRecord[] {
    const studentActivityMap: { [studentId: string]: ActivityRecord } = {};

    // Step 1: Get all unique weekNumbers
    const allWeekNumbers: string[] = Array.from(
      new Set(data.map((weekData: any) => weekData.weekNumber))
    );

    // Step 2: Process each week's data
    data.forEach((weekData: any) => {
      weekData.activity.forEach((item: any) => {
        const studentId = item.studentId.id;

        // If student not added yet, initialize with 0 for all weeks
        if (!studentActivityMap[studentId]) {
          const activity: { [week: string]: number } = {};
          allWeekNumbers.forEach((week: string) => {
            activity[week] = 0;
          });

          studentActivityMap[studentId] = {
            student: {
              name: item.studentId.studentName,
              code: item.studentId.studentCode,
              studentId: studentId,
            },
            activity,
          };
        }

        // Overwrite with actual value for this week
        studentActivityMap[studentId].activity[weekData.weekNumber] =
          item.point;
      });
    });

    return Object.values(studentActivityMap);
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

  getTotal(record: ActivityRecord): number {
    return Object.values(record.activity).reduce((sum, val) => sum + val, 0);
  }

  save(): void {
    const invalidStudents = this.activityRecords.filter((record) => {
      const total = (Object.values(record.activity) as number[]).reduce(
        (sum, val) => sum + val,
        0
      );
      return total > this.activityPoint;
    });

    if (invalidStudents.length > 0) {
      const studentCodes = invalidStudents
        .map((s) => s.student.code)
        .join(', ');
      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: `${studentCodes} оюутны нийт идэвхийн оноо ${this.activityPoint}-аас хэтэрсэн байна.`,
      });
      return;
    }
    if (!this.showPreviousWeeks) {
      const currentWeek = this.getCurrentWeeks();
      const lessonId = this.lessonId;
      const attendanceData = {
        lessonId: lessonId,
        weekDay: this.selectedWeekday,
        type: this.selectedClassType,
        time: this.selectedTimes,
        weekNumber: currentWeek,
        activity: this.activityRecords.flatMap((record) =>
          Object.keys(record.activity)
            .map((date) => {
              if (date === currentWeek) {
                return {
                  studentId: record.student.studentId,
                  point: record.activity[date],
                };
              }
              return null;
            })
            .filter((item) => item !== null)
        ),
      };

      this.activityService.createActivity(attendanceData).subscribe(
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
      console.log(weeks);
      const attendanceDatas = weeks.map((item) => {
        return {
          lessonId: lessonId,
          weekDay: this.selectedWeekday,
          type: this.selectedClassType,
          time: this.selectedTimes,
          weekNumber: item,
          activity: this.activityRecords.flatMap((record) =>
            Object.keys(record.activity)
              .map((date) => {
                if (date === item) {
                  return {
                    studentId: record.student.studentId,
                    point: record.activity[date],
                  };
                }
                return null;
              })
              .filter((item) => item !== null)
          ),
        };
      });

      this.activityService.createActivityAll(attendanceDatas).subscribe(
        (response) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          });
        },
        (error) => {
          console.error('Error saving activity:', error);
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
