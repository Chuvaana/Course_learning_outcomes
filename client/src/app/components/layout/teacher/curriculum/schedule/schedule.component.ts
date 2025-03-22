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

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [TableModule, ToastModule, CommonModule, TagModule, SelectModule, ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule, InputNumber, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  @Input() lessonId: string = '';
  scheduleForm!: FormGroup;
  isNew = false;
  isLoading = true;

  constructor(private fb: FormBuilder, private service: ScheduleService, private msgService: MessageService) { }

  async ngOnInit() {
    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([]) // This will hold the schedules data
    });

    if (this.lessonId) {
      await this.readData();
    } else {
      this.setDefaultSchedules();
      this.isNew = true;
      this.isLoading = false;
    }
    console.log(this.lessonControls);

  }

  async readData() {
    this.isLoading = true; // 👈 Ачаалж эхэлж байгаа тул true болгоно
    try {
      const res = await this.service.getSchedules(this.lessonId).toPromise();
      const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
      scheduleArray.clear();

      if (res && res.length > 0) {
        this.setSchedules(res);
        this.isNew = false;
      } else {
        this.setDefaultSchedules();
        this.isNew = true;
      }
    } catch (error) {
      console.error('Алдаа:', error);
    } finally {
      this.isLoading = false; // 👈 Дата ирсний дараа false болгоно
    }
  }

  setSchedules(res: any[]): void {
    const scheduleArray = this.scheduleForm.get('schedules') as FormArray; // Type cast to FormArray
    res.forEach(schedule => {
      scheduleArray.push(this.fb.group({
        id: [schedule._id],
        lessonId: [schedule.lessonId],
        week: [schedule.week],
        title: [schedule.title],
        time: [schedule.time],
        type: [schedule.type]
      }));
    });
  }

  setDefaultSchedules(): void {
    const scheduleArray = this.scheduleForm.get('schedules') as FormArray;
    const defaultLessons = [
      { week: 1, title: 'test', time: 0, type: 'LEC' },
      { week: 2, title: 'test', time: 0, type: 'LEC' },
      { week: 3, title: 'test', time: 0, type: 'LEC' },
      { week: 4, title: 'test', time: 0, type: 'LEC' },
      { week: 5, title: 'test', time: 0, type: 'LEC' },
      { week: 6, title: 'test', time: 0, type: 'LEC' },
      { week: 7, title: 'test', time: 0, type: 'LEC' },
      { week: 8, title: 'test', time: 0, type: 'LEC' },
      { week: 9, title: 'test', time: 0, type: 'LEC' },
      { week: 10, title: 'test', time: 0, type: 'LEC' },
      { week: 11, title: 'test', time: 0, type: 'LEC' },
      { week: 12, title: 'test', time: 0, type: 'LEC' },
      { week: 1, title: 'test', time: 0, type: 'SEM' },
      { week: 2, title: 'test', time: 0, type: 'SEM' },
      { week: 3, title: 'test', time: 0, type: 'SEM' },
      { week: 4, title: 'test', time: 0, type: 'SEM' },
      { week: 5, title: 'test', time: 0, type: 'SEM' },
      { week: 6, title: 'test', time: 0, type: 'SEM' },
      { week: 7, title: 'test', time: 0, type: 'SEM' },
      { week: 8, title: 'test', time: 0, type: 'SEM' },
      { week: 9, title: 'test', time: 0, type: 'SEM' },
      { week: 10, title: 'test', time: 0, type: 'SEM' },
      { week: 11, title: 'test', time: 0, type: 'SEM' },
      { week: 12, title: 'test', time: 0, type: 'SEM' },
      { week: 1, title: 'test', time: 0, type: 'LAB' },
      { week: 2, title: 'test', time: 0, type: 'LAB' },
      { week: 3, title: 'test', time: 0, type: 'LAB' },
      { week: 4, title: 'test', time: 0, type: 'LAB' },
      { week: 5, title: 'test', time: 0, type: 'LAB' },
      { week: 6, title: 'test', time: 0, type: 'LAB' },
      { week: 7, title: 'test', time: 0, type: 'LAB' },
      { week: 8, title: 'test', time: 0, type: 'LAB' },
      { week: 9, title: 'test', time: 0, type: 'LAB' },
      { week: 10, title: 'test', time: 0, type: 'LAB' },
      { week: 11, title: 'test', time: 0, type: 'LAB' },
      { week: 12, title: 'test', time: 0, type: 'LAB' }
    ];

    defaultLessons.forEach(lesson => {
      scheduleArray.push(this.createLesson(lesson));
    });
  }

  createLesson(lesson: any) {
    return this.fb.group({
      lessonId: this.lessonId,
      week: [lesson.week],
      title: [lesson.title],
      time: [lesson.time],
      type: [lesson.type]
    });
  }
  
  get lessonControls() {
    const schedules = this.scheduleForm.get('schedules') as FormArray;
    return schedules.controls; // Return the controls directly, which are FormGroups
  }

  submitButton() {
    if (this.isNew) {
      this.service.addSchedules(this.scheduleForm.value).subscribe((res: any) => {
        this.readData();
        this.msgService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Амжилттай хадгалагдлаа!',
        });
      },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        });
    } else {
      this.service.updateSchedules(this.lessonId, this.scheduleForm.value).subscribe((res: any) => {
        this.readData();
        this.msgService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Амжилттай шинэчлэгдлээ!',
        });
      },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        });
    }
  }
}
