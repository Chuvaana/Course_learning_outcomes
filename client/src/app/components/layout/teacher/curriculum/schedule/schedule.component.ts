import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ScheduleService } from '../../../../../services/schedule.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { TabRefreshService } from '../tabRefreshService';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumber,
    ProgressSpinnerModule,
    MultiSelectModule,
    AccordionModule],
  providers: [MessageService],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
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

  constructor(
    private fb: FormBuilder,
    private service: ScheduleService,
    private msgService: MessageService,
    private tabRefreshService: TabRefreshService) { }

  async ngOnInit() {
    if (this.lessonId) {
      this.service.getCloList(this.lessonId).subscribe(res => {
        this.clos = res;
      });
      this.tabRefreshService.refresh$.subscribe(() => {
        this.readData(); // Датаг дахин ачаалах функц
      });
    }

    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([]) // This will hold the schedules data
    });

    this.scheduleSemForm = this.fb.group({
      scheduleSems: this.fb.array([]) // This will hold the schedules data
    });

    this.scheduleLabForm = this.fb.group({
      scheduleLabs: this.fb.array([]) // This will hold the schedules data
    });

    this.scheduleBdForm = this.fb.group({
      scheduleBds: this.fb.array([]) // This will hold the schedules data
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
      const resSem = await this.service.getScheduleSems(this.lessonId).toPromise();
      const resLab = await this.service.getScheduleLabs(this.lessonId).toPromise();
      const resBd = await this.service.getScheduleBds(this.lessonId).toPromise();
      const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
      const scheduleSemArray = this.scheduleSemForm.get('scheduleSems') as FormArray;
      const scheduleLabArray = this.scheduleLabForm.get('scheduleLabs') as FormArray;
      const scheduleBdArray = this.scheduleBdForm.get('scheduleBds') as FormArray;
      scheduleArray.clear();
      scheduleSemArray.clear();
      scheduleLabArray.clear();
      scheduleBdArray.clear();

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
    } catch (error) {
      console.error('Алдаа:', error);
    } finally {
      this.isLoading = false; // 👈 Дата ирсний дараа false болгоно
    }
  }

  setSchedules(res: any[]): void {
    const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
    res.forEach(schedule => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [schedule.cloRelevance.map((clo: any) => clo.id) || []], // Ensure it is always an array
        week: [{ value: schedule.week, disabled: true }],
        title: [schedule.title],
        time: [schedule.time]
      });
      scheduleArray.push(lessonGroup);
    });

  }

  setScheduleSems(res: any[]): void {
    const scheduleSemArray = this.scheduleSemForm.get('scheduleSems') as FormArray;
    res.forEach(schedule => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [schedule.cloRelevance.map((clo: any) => clo.id) || []], // Ensure it is always an array
        week: [{ value: schedule.week, disabled: true }],
        title: [schedule.title],
        time: [schedule.time]
      });
      scheduleSemArray.push(lessonGroup);
    });

  }

  setScheduleLabs(res: any[]): void {
    const scheduleLabArray = this.scheduleLabForm.get('scheduleLabs') as FormArray;
    res.forEach(schedule => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [schedule.cloRelevance.map((clo: any) => clo.id) || []], // Ensure it is always an array
        week: [schedule.week],
        title: [schedule.title],
        time: [schedule.time]
      });
      scheduleLabArray.push(lessonGroup);
    });
  }

  setScheduleBds(res: any[]): void {
    const scheduleBdArray = this.scheduleBdForm.get('scheduleBds') as FormArray;
    res.forEach(schedule => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [schedule.cloRelevance.map((clo: any) => clo.id) || []], // Ensure it is always an array
        week: [schedule.week],
        title: [schedule.title],
        adviceTime: [schedule.adviceTime],
        time: [schedule.time]
      });
      scheduleBdArray.push(lessonGroup);
    });
  }

  setDefaultSchedules(): void {
    const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
    const defaultLessons = [
      { week: 'I', title: '', time: 0, cloRelevance: [] },
      { week: 'II', title: '', time: 0, cloRelevance: [] },
      { week: 'III', title: '', time: 0, cloRelevance: [] },
      { week: 'IV', title: '', time: 0, cloRelevance: [] },
      { week: 'V', title: '', time: 0, cloRelevance: [] },
      { week: 'VI', title: '', time: 0, cloRelevance: [] },
      { week: 'VII', title: '', time: 0, cloRelevance: [] },
      { week: 'VIII', title: 'Явцын сорил 1', time: 0, cloRelevance: [] },
      { week: 'IX', title: '', time: 0, cloRelevance: [] },
      { week: 'X', title: '', time: 0, cloRelevance: [] },
      { week: 'XI', title: '', time: 0, cloRelevance: [] },
      { week: 'XII', title: '', time: 0, cloRelevance: [] },
      { week: 'XIII', title: 'Явцын сорил 2', time: 0, cloRelevance: [] },
      { week: 'XIV', title: '', time: 0, cloRelevance: [] },
      { week: 'XV', title: '', time: 0, cloRelevance: [] },
      { week: 'XVI', title: '', time: 0, cloRelevance: [] }
    ];
    defaultLessons.forEach(lesson => {
      scheduleArray.push(this.createLesson(lesson));
    });
  }
  setDefaultSemSchedules(): void {
    const scheduleSemArray = this.scheduleSemForm.get('scheduleSems') as FormArray;
    const defaultSemLessons = [
      { week: 'I', title: '', time: 0, cloRelevance: [] },
      { week: 'II', title: '', time: 0, cloRelevance: [] },
      { week: 'III', title: '', time: 0, cloRelevance: [] },
      { week: 'IV', title: '', time: 0, cloRelevance: [] },
      { week: 'V', title: '', time: 0, cloRelevance: [] },
      { week: 'VI', title: '', time: 0, cloRelevance: [] },
      { week: 'VII', title: '', time: 0, cloRelevance: [] },
      { week: 'VIII', title: '', time: 0, cloRelevance: [] },
      { week: 'IX', title: '', time: 0, cloRelevance: [] },
      { week: 'X', title: '', time: 0, cloRelevance: [] },
      { week: 'XI', title: '', time: 0, cloRelevance: [] },
      { week: 'XII', title: '', time: 0, cloRelevance: [] },
      { week: 'XIII', title: '', time: 0, cloRelevance: [] },
      { week: 'XIV', title: '', time: 0, cloRelevance: [] },
      { week: 'XV', title: '', time: 0, cloRelevance: [] },
      { week: 'XVI', title: '', time: 0, cloRelevance: [] }
    ];
    defaultSemLessons.forEach(lesson => {
      scheduleSemArray.push(this.createLesson(lesson));
    });
  }

  setDefaultLabSchedules(): void {
    const scheduleLabArray = this.scheduleLabForm.get('scheduleLabs') as FormArray;
    const defaultLessons = [
      { week: 'I', title: '', time: 0, cloRelevance: [] },
      { week: 'II', title: '', time: 0, cloRelevance: [] },
      { week: 'III', title: '', time: 0, cloRelevance: [] },
      { week: 'IV', title: '', time: 0, cloRelevance: [] },
      { week: 'V', title: '', time: 0, cloRelevance: [] },
      { week: 'VI', title: '', time: 0, cloRelevance: [] },
      { week: 'VII', title: '', time: 0, cloRelevance: [] },
      { week: 'VIII', title: '', time: 0, cloRelevance: [] },
      { week: 'IX', title: '', time: 0, cloRelevance: [] },
      { week: 'X', title: '', time: 0, cloRelevance: [] },
      { week: 'XI', title: '', time: 0, cloRelevance: [] },
      { week: 'XII', title: '', time: 0, cloRelevance: [] },
      { week: 'XIII', title: '', time: 0, cloRelevance: [] },
      { week: 'XIV', title: '', time: 0, cloRelevance: [] },
      { week: 'XV', title: '', time: 0, cloRelevance: [] },
      { week: 'XVI', title: '', time: 0, cloRelevance: [] }
    ];
    defaultLessons.forEach(lesson => {
      scheduleLabArray.push(this.createLesson(lesson));
    });
  }
  setDefaultBdSchedules(): void {
    const scheduleBdArray = this.scheduleBdForm.get('scheduleBds') as FormArray;
    const defaultBdLessons = [
      { week: 'I', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'II', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'III', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'IV', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'V', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'VI', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'VII', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'VIII', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'IX', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'X', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'XI', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'XII', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'XIII', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'XIV', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'XV', title: '', adviceTime: 0, time: 0, cloRelevance: [] },
      { week: 'XVI', title: '', adviceTime: 0, time: 0, cloRelevance: [] }
    ];
    defaultBdLessons.forEach(lesson => {
      scheduleBdArray.push(this.createBdLesson(lesson));
    });
  }

  getCloName(cloId: string): string {
    const clo = this.clos.find((c: { id: string; }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  createLesson(lesson: any) {
    return this.fb.group({
      lessonId: this.lessonId,
      week: [lesson.week],
      title: [lesson.title],
      time: [lesson.time],
      cloRelevance: [lesson.cloRelevance]
    });
  }

  createBdLesson(lesson: any) {
    return this.fb.group({
      lessonId: this.lessonId,
      week: [lesson.week],
      title: [lesson.title],
      adviceTime: [lesson.adviceTime],
      time: [lesson.time],
      cloRelevance: [lesson.cloRelevance]
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
      this.service.addSchedules(this.scheduleForm.value).subscribe((res: any) => {
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
        });

    } else {
      this.service.updateSchedules(this.lessonId, this.scheduleForm.value).subscribe((res: any) => {
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
        });

    }
  }
  saveSemSchedule() {
    if (this.isNewSem) {
      this.service.addScheduleSems(this.scheduleSemForm.value).subscribe((res: any) => {
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
        });

    } else {
      this.service.updateScheduleSems(this.lessonId, this.scheduleSemForm.value).subscribe((res: any) => {
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
        });

    }
  }


  saveLabSchedule() {
    if (this.isNewLab) {
      this.service.addScheduleLabs(this.scheduleLabForm.value).subscribe((res: any) => {
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
        });

    } else {
      this.service.updateScheduleLabs(this.lessonId, this.scheduleLabForm.value).subscribe((res: any) => {
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
        });

    }
  }

  saveBdSchedule() {
    if (this.isNewBd) {
      this.service.addScheduleBds(this.scheduleBdForm.value).subscribe((res: any) => {
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
        });

    } else {
      this.service.updateScheduleBds(this.lessonId, this.scheduleBdForm.value).subscribe((res: any) => {
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
        });

    }
  }
}
