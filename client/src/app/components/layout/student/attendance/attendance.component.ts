import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AttendanceService } from '../../../../services/attendanceService';
import { SharedDictService } from '../../teacher/shared';

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
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  attendanceData: any;
  classTypes: any[] = [];
  lessonId!: string;
  startDate!: Date;

  typeColumns: string[] = [];
  transposedWeeks: any[] = [];
  allowedTypes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private shared: SharedDictService
  ) {}

  groupedData: { type: string; weeks: { [key: string]: boolean } }[] = [];

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.shared.getDictionary(this.lessonId, true).subscribe((res) => {
      this.classTypes = res;
      this.allowedTypes = this.classTypes.map((type) => type.value);

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

  getTypeName(value: string): string {
    const found = this.classTypes.find((t) => t.value === value);
    return found ? found.label : value;
  }

  get filteredGroupedData() {
    return this.groupedData.filter((row) =>
      this.allowedTypes.includes(row.type)
    );
  }

  onSelectionChange(): void {
    this.attendanceService
      .getStudentAttendance(this.lessonId)
      .subscribe((res: any) => {
        this.attendanceData = res;

        const grouped: { [type: string]: { [week: string]: boolean } } = {};

        this.attendanceData.forEach((record: any) => {
          const type = record.type;
          const week = record.weekNumber;
          const status = record.attendance[0]?.status ?? false;

          if (!grouped[type]) {
            grouped[type] = {};
          }

          grouped[type][week] = status;
        });

        this.groupedData = Object.keys(grouped).map((type) => ({
          type,
          weeks: grouped[type],
        }));

        this.typeColumns = Object.keys(grouped);
        const allWeeks = this.getAllWeeks();

        this.transposedWeeks = allWeeks.map((week) => {
          const weekNumber = week;
          const row: any = { week: weekNumber };

          this.typeColumns.forEach((type) => {
            row[type] =
              grouped[type][weekNumber] !== undefined
                ? grouped[type][weekNumber]
                : null;
          });

          return row;
        });
      });
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

  getStatusCount(type: string): {
    present: number;
    absent: number;
    unknown: number;
  } {
    let present = 0;
    let absent = 0;
    let unknown = 0;

    for (const row of this.transposedWeeks) {
      const status = row[type];
      if (status === true) present++;
      else if (status === false) absent++;
      else unknown++;
    }

    return { present, absent, unknown };
  }
}
