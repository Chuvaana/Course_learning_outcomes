import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CLOService } from '../../../../../services/cloService';
import { ScheduleService } from '../../../../../services/schedule.service';
import { TabRefreshService } from '../tabRefreshService';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ToastModule,
    TagModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ReactiveFormsModule,
    InputNumberModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    AccordionModule,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  @Input() lessonId: string = '';
  scheduleForm!: FormGroup;
  scheduleSemForm!: FormGroup;
  scheduleLabForm!: FormGroup;
  scheduleBdForm!: FormGroup;
  isNew = false;
  isNewSem = false;
  isNewLab = false;
  isNewBd = false;
  isLoading = true;
  clos: any;
  closLecSem: any;
  closLab: any;
  cloPlan: any;
  mergedCloRelevanceCountsArray: any;
  cloRelevanceCountsLabArray: any;
  cloRelevanceCountsBdArray: any;
  // point: { [key: string]: number } = {};

  cloRelevanceCounts: { [key: string]: number } = {};
  cloRelevanceCountsSem: { [key: string]: number } = {};
  cloRelevanceCountsLab: {
    [key: string]: { count: number; lecPoint: number; labPoint: number };
  } = {};
  cloRelevanceCountsBd: { [key: string]: { count: number; point: number } } =
    {};
  mergedCloRelevanceCounts: {
    [key: string]: { semCount: number; count: number; point: number };
  } = {};

  constructor(
    private fb: FormBuilder,
    private service: ScheduleService,
    private cloService: CLOService,
    private msgService: MessageService,
    private tabRefreshService: TabRefreshService
  ) {}

  async ngOnInit() {
    if (this.lessonId) {
      this.tabRefreshService.refresh$.subscribe(() => {
        this.service.getCloList(this.lessonId).subscribe((res) => {
          this.clos = res;
          this.closLecSem = this.clos.filter(
            (item: any) => item.type === 'LEC_SEM'
          );
          this.closLab = this.clos.filter((item: any) => item.type === 'LAB');
        });
        this.readData(); // Датаг дахин ачаалах функц
      });
    }

    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([]), // This will hold the schedules data
    });

    this.scheduleSemForm = this.fb.group({
      scheduleSems: this.fb.array([]), // This will hold the schedules data
    });

    this.scheduleLabForm = this.fb.group({
      scheduleLabs: this.fb.array([]), // This will hold the schedules data
    });

    this.scheduleBdForm = this.fb.group({
      scheduleBds: this.fb.array([]), // This will hold the schedules data
    });

    if (this.lessonId) {
      await this.readData();
    } else {
      this.setDefaultSchedules();
      this.setDefaultSemSchedules();
      this.setDefaultLabSchedules();
      this.setDefaultBdSchedules();
      this.isNew = true;
      this.isNewSem = true;
      this.isNewLab = true;
      this.isNewBd = true;
      this.isLoading = false;
    }
  }

  async readData() {
    this.isLoading = true;
    try {
      const res = await this.service.getSchedules(this.lessonId).toPromise();
      const resSem = await this.service
        .getScheduleSems(this.lessonId)
        .toPromise();
      const resLab = await this.service
        .getScheduleLabs(this.lessonId)
        .toPromise();
      const resBd = await this.service
        .getScheduleBds(this.lessonId)
        .toPromise();
      const cloPlan = await this.cloService
        .getCloPlan(this.lessonId)
        .toPromise();
      const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
      const scheduleSemArray = this.scheduleSemForm.get(
        'scheduleSems'
      ) as FormArray;
      const scheduleLabArray = this.scheduleLabForm.get(
        'scheduleLabs'
      ) as FormArray;
      const scheduleBdArray = this.scheduleBdForm.get(
        'scheduleBds'
      ) as FormArray;
      scheduleArray.clear();
      scheduleSemArray.clear();
      scheduleLabArray.clear();
      scheduleBdArray.clear();
      this.cloPlan = cloPlan;

      if (res && res.length > 0) {
        this.setSchedules(res);
        this.isNew = false;
      } else {
        this.setDefaultSchedules();
        this.isNew = true;
      }
      if (resSem && resSem.length > 0) {
        this.setScheduleSems(resSem);
        this.isNewSem = false;
      } else {
        this.setDefaultSemSchedules();
        this.isNewSem = true;
      }
      if (resLab && resLab.length > 0) {
        this.setScheduleLabs(resLab);
        this.isNewLab = false;
      } else {
        this.setDefaultLabSchedules();
        this.isNewLab = true;
      }
      if (resBd && resBd.length > 0) {
        this.setScheduleBds(resBd);
        this.isNewBd = false;
      } else {
        this.setDefaultBdSchedules();
        this.isNewBd = true;
      }

      let point: { [key: string]: number } = {}; // Initialize point as an empty object

      for (const cloKey in this.cloPlan) {
        if (this.cloPlan.hasOwnProperty(cloKey)) {
          // Check if the property belongs to the object
          const clo = this.cloPlan[cloKey]; // Access the object using the key
          point[clo.cloId] = clo.timeManagement + clo.engagement; // Now you can access cloId
        }
      }

      console.log(point);

      // Merge cloRelevanceCounts
      for (const key in this.cloRelevanceCounts) {
        if (this.cloRelevanceCounts.hasOwnProperty(key)) {
          this.mergedCloRelevanceCounts[key] = {
            semCount: 0, // Initialize semCount to 0
            count: this.cloRelevanceCounts[key],
            point: point[key], // Set the count from the first object
          };
        }
      }

      // Merge cloRelevanceCountsSem
      for (const key in this.cloRelevanceCountsSem) {
        if (this.cloRelevanceCountsSem.hasOwnProperty(key)) {
          if (this.mergedCloRelevanceCounts[key]) {
            // If the key exists, sum the counts
            this.mergedCloRelevanceCounts[key].semCount =
              this.cloRelevanceCountsSem[key];
          } else {
            // If the key does not exist, initialize it
            this.mergedCloRelevanceCounts[key] = {
              semCount: this.cloRelevanceCountsSem[key],
              count: 0,
              point: point[key],
            };
          }
        }
      }

      // Now mergedCloRelevanceCounts contains the merged data
      console.log(this.mergedCloRelevanceCounts);

      // Convert mergedCloRelevanceCounts to an array for display
      this.mergedCloRelevanceCountsArray = Object.keys(
        this.mergedCloRelevanceCounts
      ).map((key) => ({
        key: key,
        semCount: this.mergedCloRelevanceCounts[key].semCount,
        count: this.mergedCloRelevanceCounts[key].count,
        point: this.mergedCloRelevanceCounts[key].point,
      }));
    } catch (error) {
      console.error('Алдаа:', error);
    } finally {
      this.isLoading = false; // 👈 Дата ирсний дараа false болгоно
    }
  }

  setSchedules(res: any[]): void {
    const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
    res.forEach((schedule) => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [
          schedule.cloRelevance?._id || schedule.cloRelevance || '',
        ], // Ensure it is always an array
        week: [{ value: schedule.week, disabled: true }],
        title: [schedule.title],
        time: [schedule.time],
      });
      scheduleArray.push(lessonGroup);
    });
    let cloRelevanceCounts: { [key: string]: number } = {};
    const data = scheduleArray.value;
    data.forEach((item: any) => {
      const clo = item.cloRelevance;
      if (clo) {
        cloRelevanceCounts[clo] = (cloRelevanceCounts[clo] || 0) + 1;
      }
    });
    this.cloRelevanceCounts = cloRelevanceCounts;
    console.log(this.cloRelevanceCounts);
  }

  setScheduleSems(res: any[]): void {
    const scheduleSemArray = this.scheduleSemForm.get(
      'scheduleSems'
    ) as FormArray;
    res.forEach((schedule) => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [
          schedule.cloRelevance?._id || schedule.cloRelevance || '',
        ], // Ensure it is always an array
        week: [{ value: schedule.week, disabled: true }],
        title: [schedule.title],
        time: [schedule.time],
      });
      scheduleSemArray.push(lessonGroup);
    });
    let cloRelevanceCounts: { [key: string]: number } = {};
    const data = scheduleSemArray.value;
    data.forEach((item: any) => {
      const clo = item.cloRelevance;
      if (clo) {
        cloRelevanceCounts[clo] = (cloRelevanceCounts[clo] || 0) + 1;
      }
    });

    this.cloRelevanceCountsSem = cloRelevanceCounts;
    console.log(this.cloRelevanceCountsSem);
  }

  setScheduleLabs(res: any[]): void {
    const scheduleLabArray = this.scheduleLabForm.get(
      'scheduleLabs'
    ) as FormArray;
    res.forEach((schedule) => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [
          schedule.cloRelevance?._id || schedule.cloRelevance || '',
        ], // Ensure it is always an array
        week: [schedule.week],
        title: [schedule.title],
        time: [schedule.time],
      });
      scheduleLabArray.push(lessonGroup);
    });
    let cloRelevanceCounts: {
      [key: string]: { count: number; lecPoint: number; labPoint: number };
    } = {};
    const data = scheduleLabArray.value;
    let lecPoint: { [key: string]: number } = {};
    let labPoint: { [key: string]: number } = {};

    for (const cloKey in this.cloPlan) {
      if (this.cloPlan.hasOwnProperty(cloKey)) {
        // Check if the property belongs to the object
        const clo = this.cloPlan[cloKey]; // Access the object using the key
        lecPoint[clo.cloId] = clo.timeManagement + clo.engagement; // Now you can access cloId
        labPoint[clo.cloId] = clo.toExp + clo.processing; // Now you can access cloId
      }
    }

    // data.forEach((item: any) => {
    //   item.cloRelevance.forEach((clo: any) => {
    //     // Initialize the cloRelevanceCounts entry if it doesn't exist
    //     if (!cloRelevanceCounts[clo]) {
    //       cloRelevanceCounts[clo] = { count: 0, lecPoint: 0, labPoint: 0 }; // Initialize count and point
    //     }

    //     // Increment the count
    //     cloRelevanceCounts[clo].count += 1;

    //     // Add the point from the previously calculated points
    //     if (lecPoint[clo]) {
    //       cloRelevanceCounts[clo].lecPoint = lecPoint[clo]; // Increment the point
    //     }
    //     // Add the point from the previously calculated points
    //     if (labPoint[clo]) {
    //       cloRelevanceCounts[clo].labPoint = labPoint[clo]; // Increment the point
    //     }
    //   });
    // });

    this.cloRelevanceCountsLab = cloRelevanceCounts;
    this.cloRelevanceCountsLabArray = Object.keys(
      this.cloRelevanceCountsLab
    ).map((key) => ({
      key: key,
      count: this.cloRelevanceCountsLab[key].count,
      lecPoint: this.cloRelevanceCountsLab[key].lecPoint,
      labPoint: this.cloRelevanceCountsLab[key].labPoint,
    }));
  }

  setScheduleBds(res: any[]): void {
    const scheduleBdArray = this.scheduleBdForm.get('scheduleBds') as FormArray;
    res.forEach((schedule) => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [
          schedule.cloRelevance?._id || schedule.cloRelevance || '',
        ], // Ensure it is always an array
        week: [schedule.week],
        title: [schedule.title],
        adviceTime: [schedule.adviceTime],
        time: [schedule.time],
      });
      scheduleBdArray.push(lessonGroup);
    });
    let cloRelevanceCounts: {
      [key: string]: { count: number; point: number };
    } = {};
    const data = scheduleBdArray.value;
    let point: { [key: string]: number } = {};

    for (const cloKey in this.cloPlan) {
      if (this.cloPlan.hasOwnProperty(cloKey)) {
        // Check if the property belongs to the object
        const clo = this.cloPlan[cloKey]; // Access the object using the key
        point[clo.cloId] =
          clo.decisionMaking +
          clo.formulation +
          clo.analysis +
          clo.implementation; // Now you can access cloId
      }
    }

    // data.forEach((item: any) => {
    //   item.cloRelevance.forEach((clo: any) => {
    //     // Initialize the cloRelevanceCounts entry if it doesn't exist
    //     if (!cloRelevanceCounts[clo]) {
    //       cloRelevanceCounts[clo] = { count: 0, point: 0 }; // Initialize count and point
    //     }

    //     // Increment the count
    //     cloRelevanceCounts[clo].count += 1;

    //     // Add the point from the previously calculated points
    //     if (point[clo]) {
    //       cloRelevanceCounts[clo].point = point[clo]; // Increment the point
    //     }
    //   });
    // });

    this.cloRelevanceCountsBd = cloRelevanceCounts;
    this.cloRelevanceCountsBdArray = Object.keys(this.cloRelevanceCountsBd).map(
      (key) => ({
        key: key,
        count: this.cloRelevanceCountsBd[key].count,
        point: this.cloRelevanceCountsBd[key].point,
      })
    );
  }

  setDefaultSchedules(): void {
    const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
    const defaultLessons = [
      { week: 'I', title: '', time: 2, cloRelevance: '' },
      { week: 'II', title: '', time: 2, cloRelevance: '' },
      { week: 'III', title: '', time: 2, cloRelevance: '' },
      { week: 'IV', title: '', time: 2, cloRelevance: '' },
      { week: 'V', title: '', time: 2, cloRelevance: '' },
      { week: 'VI', title: '', time: 2, cloRelevance: '' },
      { week: 'VII', title: '', time: 2, cloRelevance: '' },
      { week: 'VIII', title: 'Явцын сорил 1', time: 2, cloRelevance: '' },
      { week: 'IX', title: '', time: 2, cloRelevance: '' },
      { week: 'X', title: '', time: 2, cloRelevance: '' },
      { week: 'XI', title: '', time: 2, cloRelevance: '' },
      { week: 'XII', title: '', time: 2, cloRelevance: '' },
      { week: 'XIII', title: 'Явцын сорил 2', time: 2, cloRelevance: '' },
      { week: 'XIV', title: '', time: 2, cloRelevance: '' },
      { week: 'XV', title: '', time: 2, cloRelevance: '' },
      { week: 'XVI', title: '', time: 2, cloRelevance: '' },
    ];
    defaultLessons.forEach((lesson) => {
      scheduleArray.push(this.createLesson(lesson));
    });
  }
  setDefaultSemSchedules(): void {
    const scheduleSemArray = this.scheduleSemForm.get(
      'scheduleSems'
    ) as FormArray;
    const defaultSemLessons = [
      { week: 'I', title: '', time: 2, cloRelevance: '' },
      { week: 'II', title: '', time: 2, cloRelevance: '' },
      { week: 'III', title: '', time: 2, cloRelevance: '' },
      { week: 'IV', title: '', time: 2, cloRelevance: '' },
      { week: 'V', title: '', time: 2, cloRelevance: '' },
      { week: 'VI', title: '', time: 2, cloRelevance: '' },
      { week: 'VII', title: '', time: 2, cloRelevance: '' },
      { week: 'VIII', title: '', time: 2, cloRelevance: '' },
      { week: 'IX', title: '', time: 2, cloRelevance: '' },
      { week: 'X', title: '', time: 2, cloRelevance: '' },
      { week: 'XI', title: '', time: 2, cloRelevance: '' },
      { week: 'XII', title: '', time: 2, cloRelevance: '' },
      { week: 'XIII', title: '', time: 2, cloRelevance: '' },
      { week: 'XIV', title: '', time: 2, cloRelevance: '' },
      { week: 'XV', title: '', time: 2, cloRelevance: '' },
      { week: 'XVI', title: '', time: 2, cloRelevance: '' },
    ];
    defaultSemLessons.forEach((lesson) => {
      scheduleSemArray.push(this.createLesson(lesson));
    });
  }

  setDefaultLabSchedules(): void {
    const scheduleLabArray = this.scheduleLabForm.get(
      'scheduleLabs'
    ) as FormArray;
    const defaultLessons = [
      { week: 'I', title: '', time: 2, cloRelevance: '' },
      { week: 'II', title: '', time: 2, cloRelevance: '' },
      { week: 'III', title: '', time: 2, cloRelevance: '' },
      { week: 'IV', title: '', time: 2, cloRelevance: '' },
      { week: 'V', title: '', time: 2, cloRelevance: '' },
      { week: 'VI', title: '', time: 2, cloRelevance: '' },
      { week: 'VII', title: '', time: 2, cloRelevance: '' },
      { week: 'VIII', title: '', time: 2, cloRelevance: '' },
      { week: 'IX', title: '', time: 2, cloRelevance: '' },
      { week: 'X', title: '', time: 2, cloRelevance: '' },
      { week: 'XI', title: '', time: 2, cloRelevance: '' },
      { week: 'XII', title: '', time: 2, cloRelevance: '' },
      { week: 'XIII', title: '', time: 2, cloRelevance: '' },
      { week: 'XIV', title: '', time: 2, cloRelevance: '' },
      { week: 'XV', title: '', time: 2, cloRelevance: '' },
      { week: 'XVI', title: '', time: 2, cloRelevance: '' },
    ];
    defaultLessons.forEach((lesson) => {
      scheduleLabArray.push(this.createLesson(lesson));
    });
  }

  setDefaultBdSchedules(): void {
    const scheduleBdArray = this.scheduleBdForm.get('scheduleBds') as FormArray;
    const defaultBdLessons = [
      { week: 'I', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'II', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'III', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'IV', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'V', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'VI', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'VII', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'VIII', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'IX', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'X', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'XI', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'XII', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'XIII', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'XIV', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'XV', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
      { week: 'XVI', title: '', adviceTime: 0, time: 0, cloRelevance: '' },
    ];
    defaultBdLessons.forEach((lesson) => {
      scheduleBdArray.push(this.createBdLesson(lesson));
    });
  }

  getCloName(cloId: string): string {
    const clo = this.clos.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : '';
  }

  createLesson(lesson: any) {
    return this.fb.group({
      lessonId: this.lessonId,
      week: [lesson.week],
      title: [lesson.title],
      time: [lesson.time],
      cloRelevance: [lesson.cloRelevance],
    });
  }

  createBdLesson(lesson: any) {
    return this.fb.group({
      lessonId: this.lessonId,
      week: [lesson.week],
      title: [lesson.title],
      adviceTime: [lesson.adviceTime],
      time: [lesson.time],
      cloRelevance: [lesson.cloRelevance],
    });
  }

  get lessonControls() {
    const schedules = this.scheduleForm.get('schedules') as FormArray;
    return schedules.controls;
  }

  get lessonSemControls() {
    const schedules = this.scheduleSemForm.get('scheduleSems') as FormArray;
    return schedules.controls;
  }

  get lessonLabControls() {
    const schedules = this.scheduleLabForm.get('scheduleLabs') as FormArray;
    return schedules.controls;
  }

  get lessonBdControls() {
    const schedules = this.scheduleBdForm.get('scheduleBds') as FormArray;
    return schedules.controls;
  }

  saveLecSchedule() {
    if (this.isNew) {
      this.service.addSchedules(this.scheduleForm.value).subscribe(
        (res: any) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service
        .updateSchedules(this.lessonId, this.scheduleForm.value)
        .subscribe(
          (res: any) => {
            this.readData();
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай шинэчлэгдлээ!',
            });
          },
          (err) => {
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Алдаа гарлаа: ' + err.message,
            });
          }
        );
    }
  }
  saveSemSchedule() {
    if (this.isNewSem) {
      this.service.addScheduleSems(this.scheduleSemForm.value).subscribe(
        (res: any) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service
        .updateScheduleSems(this.lessonId, this.scheduleSemForm.value)
        .subscribe(
          (res: any) => {
            this.readData();
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай шинэчлэгдлээ!',
            });
          },
          (err) => {
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Алдаа гарлаа: ' + err.message,
            });
          }
        );
    }
  }

  saveLabSchedule() {
    if (this.isNewLab) {
      this.service.addScheduleLabs(this.scheduleLabForm.value).subscribe(
        (res: any) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service
        .updateScheduleLabs(this.lessonId, this.scheduleLabForm.value)
        .subscribe(
          (res: any) => {
            this.readData();
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай шинэчлэгдлээ!',
            });
          },
          (err) => {
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Алдаа гарлаа: ' + err.message,
            });
          }
        );
    }
  }

  saveBdSchedule() {
    if (this.isNewBd) {
      this.service.addScheduleBds(this.scheduleBdForm.value).subscribe(
        (res: any) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service
        .updateScheduleBds(this.lessonId, this.scheduleBdForm.value)
        .subscribe(
          (res: any) => {
            this.readData();
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай шинэчлэгдлээ!',
            });
          },
          (err) => {
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Алдаа гарлаа: ' + err.message,
            });
          }
        );
    }
  }
}
