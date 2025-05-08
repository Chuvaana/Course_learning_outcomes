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
import { CloPointPlanService } from '../../../../../../services/cloPointPlanService';
import { ToastModule } from 'primeng/toast';
import { AssessmentPlanService } from '../../../../../../services/assessmentPlanService';

interface DataRow {
  formGroup: FormGroup;
  week: string; // Roman numeral week string
  weekNum: number; // numeric week for sorting
  cloName: string;
  type: string;
  weekRowSpan?: number;
  cloRowSpan?: number;
  isFirstWeek?: boolean;
  isFirstClo?: boolean;
}

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
    ToastModule,
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
    private msgService: MessageService,
    private cloPointService: CloPointPlanService,
    private assessPlan: AssessmentPlanService
  ) {}

  lessonId!: string;
  methodList: any[] = [];
  cloList: any[] = [];
  weekOptions: { label: string; value: string }[] = [];
  pointPlanA: any[] = [];

  form!: FormGroup;
  isNew = true;

  tableData: {
    type: string;
    week: string;
    method: string;
    methodName: string;
    clo: string;
    score: number;
    weekNum?: number; // keep number added
  }[] = [];

  groupedDataSource: { [type: string]: DataRow[] } = {};

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
      this.initializeWeekOptions();
      this.assessPlan.getAssessmentPlan(this.lessonId).subscribe((res: any) => {
        if (res.length != 0) {
          this.isNew = false;
          this.tableData = res.map((item: any) => ({
            type: item.type,
            week: item.week,
            method: item.method,
            methodName: item.methodName,
            clo: item.clo,
            cloName: item.cloName, // 👈 make sure this is present in your response
            score: item.score,
            weekNum: this.romanToNumber(item.week),
          }));
          this.form = this.fb.group({
            rows: this.fb.array(
              this.tableData.map((d) => this.createRowForm(d))
            ),
          });

          this.groupData();
        } else {
          this.isNew = true;
          this.loadAssessment(this.lessonId);
        }
      });
    });
  }

  groupData() {
    const allRows: DataRow[] = this.rows.controls.map((fg) => {
      const week = fg.get('week')?.value!;
      return {
        formGroup: fg,
        week: week,
        weekNum: this.romanToNumber(week),
        cloName: fg.get('cloName')?.value!,
        type: fg.get('type')?.value!,
        weekRowSpan: 0,
        cloRowSpan: 0,
        isFirstWeek: false,
        isFirstClo: false,
      };
    });

    allRows.sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      if (a.weekNum < b.weekNum) return -1;
      if (a.weekNum > b.weekNum) return 1;
      if (a.cloName < b.cloName) return -1;
      if (a.cloName > b.cloName) return 1;
      return 0;
    });

    this.groupedDataSource = {};
    allRows.forEach((row) => {
      if (!this.groupedDataSource[row.type]) {
        this.groupedDataSource[row.type] = [];
      }
      this.groupedDataSource[row.type].push(row);
    });

    Object.keys(this.groupedDataSource).forEach((type) => {
      const group = this.groupedDataSource[type];

      const weeksMap: { [week: string]: DataRow[] } = {};
      group.forEach((row) => {
        if (!weeksMap[row.week]) weeksMap[row.week] = [];
        weeksMap[row.week].push(row);
      });

      Object.values(weeksMap).forEach((weekRows) => {
        weekRows.forEach((r) => {
          r.weekRowSpan = 0;
          r.isFirstWeek = false;
          r.cloRowSpan = 0;
          r.isFirstClo = false;
        });

        if (weekRows.length === 0) return;
        weekRows[0].weekRowSpan = weekRows.length;
        weekRows[0].isFirstWeek = true;

        const cloMap: { [cloName: string]: DataRow[] } = {};
        weekRows.forEach((row) => {
          if (!cloMap[row.cloName]) cloMap[row.cloName] = [];
          cloMap[row.cloName].push(row);
        });

        Object.values(cloMap).forEach((cloRows) => {
          cloRows.forEach((r) => {
            r.cloRowSpan = 0;
            r.isFirstClo = false;
          });
          if (cloRows.length === 0) return;
          cloRows[0].cloRowSpan = cloRows.length;
          cloRows[0].isFirstClo = true;
        });
      });
    });
  }

  initializeWeekOptions() {
    this.weekOptions = [];
    for (let i = 1; i <= 16; i++) {
      this.weekOptions.push({ label: this.toRoman(i), value: this.toRoman(i) });
    }
  }

  onWeekChange(formGroup: FormGroup) {
    const newWeek = formGroup.get('week')?.value;
    const oldWeek = formGroup.get('oldWeek')?.value;
    const newWeekNum = this.romanToNumber(newWeek);
    const type = formGroup.get('type')?.value;

    this.rows.controls.forEach((row) => {
      const rowType = row.get('type')?.value;
      const rowWeek = row.get('week')?.value;
      const rowWeekNum = this.romanToNumber(rowWeek);

      if (rowType === type && rowWeek === oldWeek && rowWeekNum < newWeekNum) {
        row.get('week')?.setValue(newWeek);
        row.get('oldWeek')?.setValue(newWeek);
      }
    });

    formGroup.get('oldWeek')?.setValue(newWeek);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  romanToNumber(roman: string): number {
    const romanMap: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
    let number = 0;
    let prev = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
      const current = romanMap[roman[i]];
      if (current >= prev) {
        number += current;
      } else {
        number -= current;
      }
      prev = current;
    }
    return number;
  }

  loadAssessment(id: string) {
    forkJoin({
      assessments: this.service.getAssessmentByLesson(id) as Observable<{
        plans: any[];
      }>,
      pointPlan: this.cloPointService.getPointPlan(this.lessonId),
      cloList: this.service.getCloList(id) as Observable<any[]>,
    }).subscribe(({ assessments, pointPlan, cloList }) => {
      const tempTableData: any[] = [];
      this.cloList = cloList;
      pointPlan.map((item: any) => {
        item.procPoints.map((proc: any) => {
          this.pointPlanA.push({
            cloId: item.cloId,
            methodId: proc.subMethodId,
            point: proc.point,
          });
        });
      });

      this.pointPlanA.map((po: any) => {
        cloList.forEach((clo: any) => {
          assessments.plans.forEach((item: any) => {
            if (item.methodType === 'PROC') {
              item.subMethods.forEach((me: any) => {
                const matchesType =
                  (item.secondMethodType === 'CLAB' && clo.type === 'CLAB') ||
                  (item.secondMethodType === 'BSEM' && clo.type === 'BSEM') ||
                  item.secondMethodType === 'BD';
                if (
                  matchesType &&
                  po.point != 0 &&
                  po.cloId == clo.id &&
                  po.methodId == me._id
                ) {
                  const freq = item.frequency ?? 1;
                  for (let i = 1; i <= freq && i <= 16; i++) {
                    const romanWeek = this.toRoman(i);
                    tempTableData.push({
                      type: item.secondMethodType,
                      week: romanWeek,
                      weekNum: i,
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
      });

      this.tableData = tempTableData;

      this.form = this.fb.group({
        rows: this.fb.array(this.tableData.map((d) => this.createRowForm(d))),
      });

      const allRows: DataRow[] = this.rows.controls.map((fg) => {
        const week = fg.get('week')?.value!;
        return {
          formGroup: fg,
          week: week,
          weekNum: this.romanToNumber(week),
          cloName: fg.get('cloName')?.value!,
          type: fg.get('type')?.value!,
          weekRowSpan: 0,
          cloRowSpan: 0,
          isFirstWeek: false,
          isFirstClo: false,
        };
      });

      allRows.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        if (a.weekNum < b.weekNum) return -1;
        if (a.weekNum > b.weekNum) return 1;
        if (a.cloName < b.cloName) return -1;
        if (a.cloName > b.cloName) return 1;
        return 0;
      });

      this.groupedDataSource = {};
      allRows.forEach((row) => {
        if (!this.groupedDataSource[row.type]) {
          this.groupedDataSource[row.type] = [];
        }
        this.groupedDataSource[row.type].push(row);
      });

      Object.keys(this.groupedDataSource).forEach((type) => {
        const group = this.groupedDataSource[type];

        const weeksMap: { [week: string]: DataRow[] } = {};
        group.forEach((row) => {
          if (!weeksMap[row.week]) weeksMap[row.week] = [];
          weeksMap[row.week].push(row);
        });

        Object.values(weeksMap).forEach((weekRows) => {
          weekRows.forEach((r) => {
            r.weekRowSpan = 0;
            r.isFirstWeek = false;
            r.cloRowSpan = 0;
            r.isFirstClo = false;
          });

          if (weekRows.length === 0) return;
          weekRows[0].weekRowSpan = weekRows.length;
          weekRows[0].isFirstWeek = true;

          const cloMap: { [cloName: string]: DataRow[] } = {};
          weekRows.forEach((row) => {
            if (!cloMap[row.cloName]) cloMap[row.cloName] = [];
            cloMap[row.cloName].push(row);
          });

          Object.values(cloMap).forEach((cloRows) => {
            cloRows.forEach((r) => {
              r.cloRowSpan = 0;
              r.isFirstClo = false;
            });
            if (cloRows.length === 0) return;
            cloRows[0].cloRowSpan = cloRows.length;
            cloRows[0].isFirstClo = true;
          });
        });
      });
    });
  }

  get rows(): FormArray<FormGroup> {
    return this.form.get('rows') as FormArray<FormGroup>;
  }

  createRowForm(data: any): FormGroup {
    return this.fb.group({
      lessonId: [{ value: this.lessonId, disabled: true }],
      type: [{ value: data.type, disabled: true }],
      week: [data.week],
      oldWeek: [data.week],
      method: [{ value: data.method, disabled: true }],
      methodName: [{ value: data.methodName, disabled: true }],
      clo: [{ value: data.clo, disabled: true }],
      cloName: [{ value: data.cloName, disabled: true }],
      score: [data.score],
    });
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

  checkData(data: any) {
    let warn = false;
    const scoreSums: {
      [key: string]: {
        cloName: string;
        methodName: string;
        totalScore: number;
      };
    } = {};

    data.forEach((row: any) => {
      const key = `${row.clo}_${row.method}`;
      if (!scoreSums[key]) {
        scoreSums[key] = {
          cloName: row.cloName,
          methodName: row.methodName,
          totalScore: 0,
        };
      }
      scoreSums[key].totalScore += row.score;
    });

    const result = Object.entries(scoreSums).map(([key, value]) => ({
      clo: key.split('_')[0],
      method: key.split('_')[1],
      cloName: value.cloName,
      methodName: value.methodName,
      totalScore: value.totalScore,
    }));

    this.pointPlanA.forEach((ref) => {
      const matching = result.find(
        (r) => r.clo === ref.cloId && r.method === ref.methodId
      );
      const score = matching?.totalScore ?? 0;

      if (score !== ref.point && matching) {
        warn = true;
        this.msgService.add({
          severity: 'warn',
          summary: 'Анхааруулга',
          detail: `Оноо таарахгүй байна: CLO (${matching?.cloName}), Method (${matching?.methodName}) — Нийлбэр оноо: ${score}, Зөв оноо: ${ref.point}`,
        });
        return;
      }
    });
    console.log(result);

    return warn;
  }

  saveData() {
    const data = this.rows.getRawValue();
    if (!this.checkData(data)) {
      if (this.isNew) {
        this.assessPlan.addAssessmentPlan(data).subscribe((res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          });
        });
      } else {
        this.assessPlan
          .updateAssessmentPlan(this.lessonId, data)
          .subscribe((res) => {
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай хадгалагдлаа',
            });
          });
      }
    }
    console.log('All assessment data:', data);
  }
}
