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
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AssessmentService } from '../../../../../services/assessmentService';
import { CurriculumService } from '../../../../../services/curriculum.service';
import { ScheduleService } from '../../../../../services/schedule.service';
import { TabRefreshService } from '../tabRefreshService';

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
  scheduleLecForm!: FormGroup;
  scheduleSemForm!: FormGroup;
  scheduleLabForm!: FormGroup;
  scheduleBdForm!: FormGroup;

  isNewLec = false;
  isNewSem = false;
  isNewLab = false;
  isNewBd = false;
  isLoading = true;

  hasLec = false;
  hasSem = false;
  hasLab = false;
  hasBd = false;

  clos: any;
  closLec: any;
  closSem: any;
  closLab: any;

  labSumPoint = 0;
  semSumPoint = 0;
  bdSumPoint = 0;

  labFreq = 0;
  semFreq = 0;
  bdFreq = 0;

  labData: any;
  semData: any;
  bdData: any;

  constructor(
    private fb: FormBuilder,
    private service: ScheduleService,
    private msgService: MessageService,
    private tabRefreshService: TabRefreshService,
    private mainService: CurriculumService,
    private assessService: AssessmentService
  ) {}

  async ngOnInit() {
    if (this.lessonId) {
      this.tabRefreshService.refresh$.subscribe(() => {
        this.service.getCloList(this.lessonId).subscribe((res) => {
          this.clos = res;
          this.closLec = this.clos.filter((item: any) => item.type === 'ALEC');
          this.closSem = this.clos.filter((item: any) => item.type === 'BSEM');
          this.closLab = this.clos.filter((item: any) => item.type === 'CLAB');
        });
      });
    }

    this.scheduleLecForm = this.fb.group({
      schedules: this.fb.array([]),
    });

    this.scheduleSemForm = this.fb.group({
      scheduleSems: this.fb.array([]),
    });

    this.scheduleLabForm = this.fb.group({
      scheduleLabs: this.fb.array([]),
    });

    this.scheduleBdForm = this.fb.group({
      scheduleBds: this.fb.array([]),
    });

    if (this.lessonId) {
      await this.readData();
    } else {
      this.setDefaultLecSchedules();
      this.setDefaultSemSchedules();
      this.setDefaultLabSchedules();
      this.setDefaultBdSchedules();
      this.isNewLec = true;
      this.isNewSem = true;
      this.isNewLab = true;
      this.isNewBd = true;
      this.isLoading = false;
    }
  }

  async readData() {
    this.isLoading = true;
    try {
      this.mainService.getMainInfo(this.lessonId).subscribe((response: any) => {
        if (response) {
          this.hasLec = response.weeklyHours.lecture == 0 ? false : true;
          this.hasSem = response.weeklyHours.seminar == 0 ? false : true;
          this.hasLab = response.weeklyHours.lab == 0 ? false : true;
          this.hasBd = response.weeklyHours.assignment == 0 ? false : true;
        }
      });

      this.labSumPoint = 0;
      this.semSumPoint = 0;
      this.bdSumPoint = 0;
      this.assessService
        .getAssessmentByLesson(this.lessonId)
        .subscribe((res: any) => {
          if (res.plans.length === 0) {
            this.msgService.add({
              severity: 'warn',
              summary: 'Анхааруулга',
              detail:
                'Хичээлийн төлөвлөгөө бүртгээгүй байна. Төлөвлөгөөгөө бүртгэнэ үү',
            });
            this.disableAll();
          }
          res.plans.forEach((element: any) => {
            if (element.methodType === 'PROC') {
              if (element.secondMethodType === 'CLAB') {
                element.subMethods.forEach((item: any) => {
                  this.labSumPoint += item.point;
                });
                this.labData = element;
                this.labFreq = element.frequency;
              } else if (element.secondMethodType === 'BSEM') {
                element.subMethods.forEach((item: any) => {
                  this.semSumPoint += item.point;
                });
                this.semData = element;
                this.semFreq = element.frequency;
              } else if (element.secondMethodType === 'BD') {
                element.subMethods.forEach((item: any) => {
                  this.bdSumPoint += item.point;
                });
                this.bdData = element;
                this.bdFreq = element.frequency;
              }
            }
          });
        });

      const resLec = await this.service.getSchedules(this.lessonId).toPromise();
      const resSem = await this.service
        .getScheduleSems(this.lessonId)
        .toPromise();
      const resLab = await this.service
        .getScheduleLabs(this.lessonId)
        .toPromise();
      const resBd = await this.service
        .getScheduleBds(this.lessonId)
        .toPromise();
      const scheduleArray = this.scheduleLecForm.get('schedules') as FormArray;
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

      if (resLec && resLec.length > 0) {
        this.setSchedules(resLec);
        this.isNewLec = false;
      } else {
        this.setDefaultLecSchedules();
        this.isNewLec = true;
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
      this.isLoading = false;
    }
  }

  disableAll() {
    this.hasBd = false;
    this.hasLab = false;
    this.hasLec = false;
    this.hasSem = false;
  }

  enable() {
    this.mainService.getMainInfo(this.lessonId).subscribe((response: any) => {
      if (response) {
        this.hasLec = response.weeklyHours.lecture == 0 ? false : true;
        this.hasSem = response.weeklyHours.seminar == 0 ? false : true;
        this.hasLab = response.weeklyHours.lab == 0 ? false : true;
        this.hasBd = response.weeklyHours.assignment == 0 ? false : true;
      }
    });
  }

  setSchedules(res: any[]): void {
    const scheduleArray = this.scheduleLecForm.get('schedules') as FormArray;
    res.forEach((schedule) => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [
          schedule.cloRelevance?.id || schedule.cloRelevance || null,
        ],
        week: [{ value: schedule.week, disabled: true }],
        title: [schedule.title],
        time: [schedule.time],
      });
      scheduleArray.push(lessonGroup);
    });
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
          schedule.cloRelevance?.id || schedule.cloRelevance || null,
        ],
        week: [{ value: schedule.week, disabled: true }],
        title: [schedule.title],
        time: [schedule.time],
        point: this.fb.array(
          schedule.point.map((mp: any) =>
            this.fb.group({
              id: [mp.id],
              point: [mp.point],
            })
          )
        ),
      });
      scheduleSemArray.push(lessonGroup);
    });
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
          schedule.cloRelevance?.id || schedule.cloRelevance || '',
        ],
        week: [schedule.week],
        title: [schedule.title],
        time: [schedule.time],
        point: this.fb.array(
          schedule.point.map((mp: any) =>
            this.fb.group({
              id: [mp.id],
              point: [mp.point],
            })
          )
        ),
      });
      scheduleLabArray.push(lessonGroup);
    });
  }

  setScheduleBds(res: any[]): void {
    const scheduleBdArray = this.scheduleBdForm.get('scheduleBds') as FormArray;
    res.forEach((schedule) => {
      const lessonGroup = this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        cloRelevance: [
          schedule.cloRelevance?.id || schedule.cloRelevance || null,
        ],
        week: [schedule.week],
        title: [schedule.title],
        adviceTime: [schedule.adviceTime],
        time: [schedule.time],
        point: this.fb.array(
          schedule.point.map((mp: any) =>
            this.fb.group({
              id: [mp.id],
              point: [mp.point],
            })
          )
        ),
      });
      scheduleBdArray.push(lessonGroup);
    });
  }

  setDefaultLecSchedules(): void {
    const scheduleArray = this.scheduleLecForm.get('schedules') as FormArray;
    const defaultLessons = [
      { week: 'I', title: '', time: 2, cloRelevance: null },
      { week: 'II', title: '', time: 2, cloRelevance: null },
      { week: 'III', title: '', time: 2, cloRelevance: null },
      { week: 'IV', title: '', time: 2, cloRelevance: null },
      { week: 'V', title: '', time: 2, cloRelevance: null },
      { week: 'VI', title: '', time: 2, cloRelevance: null },
      { week: 'VII', title: '', time: 2, cloRelevance: null },
      { week: 'VIII', title: 'Явцын сорил 1', time: 2, cloRelevance: null },
      { week: 'IX', title: '', time: 2, cloRelevance: null },
      { week: 'X', title: '', time: 2, cloRelevance: null },
      { week: 'XI', title: '', time: 2, cloRelevance: null },
      { week: 'XII', title: '', time: 2, cloRelevance: null },
      { week: 'XIII', title: 'Явцын сорил 2', time: 2, cloRelevance: null },
      { week: 'XIV', title: '', time: 2, cloRelevance: null },
      { week: 'XV', title: '', time: 2, cloRelevance: null },
      { week: 'XVI', title: '', time: 2, cloRelevance: null },
    ];
    defaultLessons.forEach((lesson) => {
      scheduleArray.push(this.createLesson(lesson));
    });
  }
  setDefaultSemSchedules(): void {
    const scheduleSemArray = this.scheduleSemForm.get(
      'scheduleSems'
    ) as FormArray;
    let methodPoint: { id: any; point: number }[] = [];
    if (this.semData) {
      this.semData.subMethods.forEach((item: any) => {
        methodPoint.push({
          id: item._id,
          point: 0,
        });
      });
    }
    const defaultSemLessons = [
      { week: 'I', title: '', time: 2, cloRelevance: null, point: methodPoint },
      {
        week: 'II',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'III',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'IV',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      { week: 'V', title: '', time: 2, cloRelevance: null, point: methodPoint },
      {
        week: 'VI',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'VII',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'IX',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      { week: 'X', title: '', time: 2, cloRelevance: null, point: methodPoint },
      {
        week: 'XI',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XII',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XIII',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XIV',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XV',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XVI',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
    ];
    defaultSemLessons.forEach((lesson) => {
      scheduleSemArray.push(this.createLessonV(lesson));
    });
  }

  setDefaultLabSchedules(): void {
    const scheduleLabArray = this.scheduleLabForm.get(
      'scheduleLabs'
    ) as FormArray;
    let methodPoint: { id: any; point: number }[] = [];
    if (this.labData) {
      this.labData.subMethods.forEach((item: any) => {
        methodPoint.push({
          id: item._id,
          point: 0,
        });
      });
    }
    const defaultLessons = [
      { week: 'I', title: '', time: 2, cloRelevance: null, point: methodPoint },
      {
        week: 'II',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'III',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'IV',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      { week: 'V', title: '', time: 2, cloRelevance: null, point: methodPoint },
      {
        week: 'VI',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'VII',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'VIII',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'IX',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      { week: 'X', title: '', time: 2, cloRelevance: null, point: methodPoint },
      {
        week: 'XI',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XII',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XIII',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XIV',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XV',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XVI',
        title: '',
        time: 2,
        cloRelevance: null,
        point: methodPoint,
      },
    ];
    defaultLessons.forEach((lesson) => {
      scheduleLabArray.push(this.createLessonV(lesson));
    });
  }

  setDefaultBdSchedules(): void {
    const scheduleBdArray = this.scheduleBdForm.get('scheduleBds') as FormArray;
    let methodPoint: { id: any; point: number }[] = [];
    if (this.bdData) {
      this.bdData.subMethods.forEach((item: any) => {
        methodPoint.push({
          id: item._id,
          point: 0,
        });
      });
    }
    const defaultBdLessons = [
      {
        week: 'I',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'II',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'III',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'IV',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'V',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'VI',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'VII',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'VIII',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'IX',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'X',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XI',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XII',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XIII',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XIV',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XV',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
      {
        week: 'XVI',
        title: '',
        adviceTime: 0,
        time: 0,
        cloRelevance: null,
        point: methodPoint,
      },
    ];
    defaultBdLessons.forEach((lesson) => {
      scheduleBdArray.push(this.createBdLesson(lesson));
    });
  }

  getCloName(cloId: string): string {
    if (cloId != '') {
      const clo = this.clos.find((c: { id: string }) => c.id === cloId);
      return clo ? clo.cloName : '';
    }
    return '';
  }

  getMethodNameById(id: string): string {
    const method = this.labData?.subMethods.find((m: any) => m._id === id);
    return method ? method.subMethod : 'Unknown';
  }

  getBdMethodNameById(id: string): string {
    const method = this.bdData?.subMethods.find((m: any) => m._id === id);
    return method ? method.subMethod : 'Unknown';
  }

  getSemMethodNameById(id: string): string {
    const method = this.semData?.subMethods.find((m: any) => m._id === id);
    return method ? method.subMethod : 'Unknown';
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

  createLessonV(lesson: any) {
    return this.fb.group({
      lessonId: this.lessonId,
      week: [lesson.week],
      title: [lesson.title],
      time: [lesson.time],
      cloRelevance: [lesson.cloRelevance],
      point: this.fb.array(
        lesson.point.map((mp: any) =>
          this.fb.group({
            id: [mp.id],
            point: [0],
          })
        )
      ),
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
      point: this.fb.array(
        lesson.point.map((mp: any) =>
          this.fb.group({
            id: [mp.id],
            point: [0],
          })
        )
      ),
    });
  }

  get lessonControls() {
    return this.scheduleLecForm.get('schedules') as FormArray;
  }

  get lessonSemControls() {
    return this.scheduleSemForm.get('scheduleSems') as FormArray;
  }

  get lessonLabControls() {
    return this.scheduleLabForm.get('scheduleLabs') as FormArray;
  }

  get lessonBdControls() {
    return this.scheduleBdForm.get('scheduleBds') as FormArray;
  }

  saveLecSchedule() {
    if (this.isNewLec) {
      this.service.addSchedules(this.scheduleLecForm.value).subscribe(
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
        .updateSchedules(this.lessonId, this.scheduleLecForm.value)
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
    const data = this.scheduleSemForm.value;
    const sum = this.checkData(data.scheduleSems);

    if (sum != this.semSumPoint) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Семинарын нийлбэр оноо ${this.semSumPoint} байх ёстой. Одоогийн нийлбэр: ${sum}`,
      });
      return;
    }

    const freq = this.checkFreq(data.scheduleSems);
    if (freq != this.semFreq) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Семинарын үзлэг хийх давтамж ${this.semFreq} байх ёстой. Одоогийн давтамж: ${freq}`,
      });
      return;
    }
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

  checkData(data: any): number {
    let sum = 0;
    data.map((item: any) => {
      item.point.map((point: any) => {
        sum += point.point;
      });
    });
    return sum;
  }

  checkFreq(data: any): number {
    let sum = 0;
    data.map((item: any) => {
      let is = false;
      item.point.map((point: any) => {
        if (point.point && point.point != 0) {
          is = true;
        }
      });
      if (is) {
        sum += 1;
      }
    });
    return sum;
  }

  saveLabSchedule() {
    const data = this.scheduleLabForm.value;
    const sum = this.checkData(data.scheduleLabs);

    if (sum != this.labSumPoint) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Лабораторийн нийлбэр оноо ${this.labSumPoint} байх ёстой. Одоогийн нийлбэр: ${sum}`,
      });
      return;
    }

    const freq = this.checkFreq(data.scheduleLabs);
    if (freq != this.labFreq) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Лабораторийн үзлэг хийх давтамж ${this.labFreq} байх ёстой. Одоогийн давтамж: ${freq}`,
      });
      return;
    }
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
    const data = this.scheduleBdForm.value;
    const sum = this.checkData(data.scheduleBds);

    if (sum != this.bdSumPoint) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Бие даалтын нийлбэр оноо ${this.bdSumPoint} байх ёстой. Одоогийн нийлбэр: ${sum}`,
      });
      return;
    }

    const freq = this.checkFreq(data.scheduleBds);
    if (freq != this.bdFreq) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Бие даалтын үзлэг хийх давтамж ${this.bdFreq} байх ёстой. Одоогийн давтамж: ${freq}`,
      });
      return;
    }
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
