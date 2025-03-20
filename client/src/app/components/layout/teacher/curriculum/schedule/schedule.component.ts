import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ScheduleService } from '../../../../../services/schedule.service';

@Component({
  selector: 'app-schedule',
  imports: [TableModule, ToastModule, CommonModule, TagModule, SelectModule, ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule, InputNumber],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  scheduleForm!: FormGroup;
  lessonCode: string = 'kjsa';
  isNew = false;

  constructor(private fb: FormBuilder, private service: ScheduleService) { }

  ngOnInit() {
    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([]) // This will hold the schedules data
    });
    this.readData();
  }

  readData(){
    this.service.getSchedules(this.lessonCode).subscribe((res: any[]) => {
      if (res && res.length > 0) {
        this.setSchedules(res); // Set schedules from response
        this.isNew = false;
      } else {
        this.setDefaultSchedules(); // Set default schedules if response is empty
        this.isNew = true;
      }
    });
  }

  setSchedules(res: any[]): void {
    const scheduleArray = this.scheduleForm.get('schedules') as FormArray; // Type cast to FormArray
    res.forEach(schedule => {
      // Add new form group for each schedule
      scheduleArray.push(this.fb.group({
        id: [schedule._id],
        lessonCode: [schedule.lessonCode],
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
  
    // Push default lessons into the form array
    defaultLessons.forEach(lesson => {
      scheduleArray.push(this.createLesson(lesson));
    });
  }

  createLesson(lesson: any) {
    return this.fb.group({
      lessonCode: this.lessonCode,
      week: [lesson.week],
      title: [lesson.title],
      time: [lesson.time],
      type: [lesson.type]
    });
  }

  get lessonControls() {
    return (this.scheduleForm.get('schedules') as FormArray).controls;
  }

  submitButton() {
    console.log(this.scheduleForm.value);
    if(this.isNew){
      this.service.addSchedules(this.scheduleForm.value).subscribe(response => {
        console.log('Data saved successfully', response);
      });
    } else { 
      this.service.updateSchedules(this.lessonCode, this.scheduleForm.value).subscribe(response => {
      console.log('Data update successfully', response);
    });

    }
  }
}
