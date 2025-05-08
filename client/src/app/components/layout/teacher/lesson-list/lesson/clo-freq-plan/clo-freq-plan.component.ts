import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { forkJoin, Observable } from 'rxjs';
import { AssessmentService } from '../../../../../../services/assessmentService';

@Component({
  selector: 'app-clo-freq-plan',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    PanelModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
  ],
  providers: [MessageService],
  templateUrl: './clo-freq-plan.component.html',
  styleUrl: './clo-freq-plan.component.scss',
})
export class CloFreqPlanComponent implements OnInit {
  constructor(
    private service: AssessmentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msgService: MessageService
  ) {}

  lessonId!: string;
  methodList: any[] = [];
  cloList: any[] = [];

  form!: FormGroup;

  dataSource: any[] = [];
  weekRowSpan: { [week: string]: number } = {};

  tableData: {
    type: string;
    week: string;
    method: string;
    methodName: string;
    clo: string;
    score: number;
  }[] = [];

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
      this.loadAssessment(this.lessonId);
    });
  }

  loadAssessment(id: string) {
    forkJoin({
      assessments: this.service.getAssessmentByLesson(id) as Observable<{
        plans: any[];
      }>,
      cloList: this.service.getCloList(id) as Observable<any[]>,
    }).subscribe(({ assessments, cloList }) => {
      const tempTableData: any[] = [];
      this.cloList = cloList;

      cloList.forEach((clo: any) => {
        assessments.plans.forEach((item: any) => {
          if (item.methodType === 'PROC') {
            item.subMethods.forEach((me: any) => {
              const matchesType =
                (item.secondMethodType === 'CLAB' && clo.type === 'CLAB') ||
                (item.secondMethodType === 'BSEM' && clo.type === 'BSEM') ||
                item.secondMethodType === 'BD';

              if (matchesType) {
                const freq = item.frequency ?? 1; // number of weeks for this method
                for (let i = 1; i <= freq && i <= 16; i++) {
                  tempTableData.push({
                    type: item.secondMethodType,
                    week: this.toRoman(i), // ← now using Roman numerals
                    method: me._id,
                    methodName: me.subMethod,
                    clo: clo.id,
                    cloName: clo.cloName,
                    score: 0,
                  });
                }
              }
            });
          }
        });
      });

      this.tableData = tempTableData;

      this.form = this.fb.group({
        rows: this.fb.array(this.tableData.map((d) => this.createRowForm(d))),
      });
      this.dataSource = this.rows.controls.map((fg, index) => ({
        formGroup: fg,
        week: fg.get('week')?.value, // used for grouping
      }));

      this.calculateWeekRowSpan();
    });
  }

  getRowSpan(week: string | undefined): number {
    if (!week) return 1;
    return this.rows.controls.filter((row) => row.get('week')?.value === week)
      .length;
  }

  isFirstOccurrence(week: string, currentIndex: number): boolean {
    // Check if this is the first occurrence of the week
    for (let i = 0; i < currentIndex; i++) {
      if (this.dataSource[i].week === week) {
        return false; // Found a previous occurrence
      }
    }
    return true; // No previous occurrence found
  }

  calculateWeekRowSpan() {
    this.weekRowSpan = {};

    // Count the occurrences of each week value
    this.dataSource.forEach((row) => {
      const week = row.week;
      if (this.weekRowSpan[week]) {
        this.weekRowSpan[week]++;
      } else {
        this.weekRowSpan[week] = 1;
      }
    });
  }

  groupByWeek(row: AbstractControl): string {
    return row.get('week')?.value ?? '';
  }

  toRoman(num: number): string {
    const romanMap: { [key: number]: string } = {
      10: 'X',
      9: 'IX',
      5: 'V',
      4: 'IV',
      1: 'I',
    };
    let roman = '';
    for (const value of Object.keys(romanMap)
      .map(Number)
      .sort((a, b) => b - a)) {
      while (num >= value) {
        roman += romanMap[value];
        num -= value;
      }
    }
    return roman;
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  createRowForm(data: any): FormGroup {
    return this.fb.group({
      type: [{ value: data.type, disabled: true }],
      week: [data.week], // засварлах боломжтой болголоо
      method: [{ value: data.method, disabled: true }],
      methodName: [{ value: data.methodName, disabled: true }],
      clo: [{ value: data.clo, disabled: true }],
      cloName: [{ value: data.cloName, disabled: true }],
      score: [data.score], // засварлах боломжтой болголоо
    });
  }

  saveData() {
    const data = this.rows.getRawValue(); // includes all rows
    console.log('All assessment data:', data);
  }
}
