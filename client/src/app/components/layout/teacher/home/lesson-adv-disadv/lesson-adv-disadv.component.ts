import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { FeedbackService } from '../../../../../services/feedbackService';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-lesson-adv-disadv',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    FloatLabelModule,
    TextareaModule,
    TableModule,
    CheckboxModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './lesson-adv-disadv.component.html',
  styleUrl: './lesson-adv-disadv.component.scss',
})
export class LessonAdvDisadvComponent {
  @Input() lessonId!: string;
  feedbackForm: FormGroup;
  isNew = false;
  isNewTask = false;

  form!: FormGroup;

  tasks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: FeedbackService,
    private msgService: MessageService
  ) {
    this.feedbackForm = this.fb.group({
      lessonId: ['', Validators.required],
      strengths: ['', Validators.required],
      weaknesses: ['', Validators.required],
      additional: [''],
    });
  }

  ngOnInit() {
    this.service.getFeedBack(this.lessonId).subscribe((res: any) => {
      if (res) {
        res = res[0];
        this.feedbackForm.patchValue({
          lessonId: res.lessonId,
          strengths: res.strengths,
          weaknesses: res.weaknesses,
          additional: res.additional,
        });
        this.isNew = false;
      } else {
        this.isNew = true;
        this.feedbackForm.get('lessonId')?.setValue(this.lessonId);
      }
    });
    this.service.getFeedBackTask(this.lessonId).subscribe((res: any) => {
      if (res.length !== 0) {
        this.tasks = res;
        this.isNewTask = false;
      } else {
        this.tasks = [
          {
            lessonId: this.lessonId,
            categoryChanged: true,
            category: 'Хичээлийн суралцахуйн үр дүн талаас:',
            index: 1,
            description:
              'CLOs-г шинэчлэн оновчтой тодорхойлох (мэдлэг, чадвар, хандлага)',
            selected: false,
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Хичээлийн суралцахуйн үр дүн талаас:',
            index: 2,
            selected: false,
            description:
              'CLOs-н түвшин (Блумын талбарын үйл үг)-г зөв тодорхойлох',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Хичээлийн суралцахуйн үр дүн талаас:',
            index: 3,
            selected: false,
            description:
              'CLOs-г сургалтын арга зүй, үнэлгээний аргуудтай зөв холбох',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: true,
            category: 'Хичээлийн агуулга талаас: ',
            index: 4,
            selected: false,
            description: 'Лекцийн хичээлийн агуулгыг шинэчлэх ',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Хичээлийн агуулга талаас: ',
            index: 5,
            selected: false,
            description: 'Семинарын хичээлийн агуулгыг шинэчлэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Хичээлийн агуулга талаас: ',
            index: 6,
            selected: false,
            description: 'Лабораторийн хичээлийн агуулгыг шинэчлэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Хичээлийн агуулга талаас: ',
            index: 7,
            selected: false,
            description:
              'Хичээлтэй холбоотой судлах материалын хүртээмжийг нэмэгдүүлэх ',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Хичээлийн агуулга талаас: ',
            index: 8,
            selected: false,
            description:
              'Хичээлийн материалыг онлайн хэлбэрээр оюутнуудад түгээх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Хичээлийн агуулга талаас: ',
            index: 9,
            selected: false,
            description:
              'Хичээлийн агуулгын талаар ажил олгогчид, төгсөгчдөөс санал авах',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: true,
            category: 'Сургах, суралцахуйн арга зүй талаас:',
            index: 10,
            selected: false,
            description:
              'Идэвхтэй сургалтын аргыг лекц, семинар, лабораторийн хичээлд хэрэглэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургах, суралцахуйн арга зүй талаас:',
            index: 11,
            selected: false,
            description:
              'Мэдээлэл холбооны технологийг сургалтын үйл ажиллагаа, үнэлгээнд хэрэглэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургах, суралцахуйн арга зүй талаас:',
            index: 12,
            selected: false,
            description:
              'Семинарын хичээлийн хэлэлцүүлэг, асуудал шийдэх даалгавруудыг CLO-той холбон дэвшүүлэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургах, суралцахуйн арга зүй талаас:',
            index: 13,
            selected: false,
            description:
              'Ангид хэлэлцүүлэг хийх, тодорхой асуудал дээр багаар ажиллуулах',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургах, суралцахуйн арга зүй талаас:',
            index: 14,
            selected: false,
            description:
              'Хичээлээс гадуур оюутнууд харилцан ярилцах, бие биедээ туслах, давтлага хийх хэлбэрүүдийг сургалтад ашиглах',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургах, суралцахуйн арга зүй талаас:',
            index: 15,
            selected: false,
            description:
              'Лабораторийн даалгавруудыг заавар дагаж ажиллах бус тодорхой асуудал шийдэх хэлбэр рүү шилжүүлэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: true,
            category: 'Сургалтын үнэлгээ талаас:',
            index: 16,
            selected: false,
            description:
              'CLOs-г үнэлэх аргууд, үнэлэх давтамж, онооны хуваарилалт, доод шалгуур зэрэг мэдээллийг хичээлийн хөтөлбөр, бусад хэлбэрээр оюутнуудад хүргэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургалтын үнэлгээ талаас:',
            index: 17,
            selected: false,
            description:
              'Явцын сорил, улирлын шалгалтын агуулгыг CLO-той холбон шинэчлэх',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургалтын үнэлгээ талаас:',
            index: 18,
            selected: false,
            description:
              'Бие даалт, төсөл, курсийн ажил, лабораторийн заавар, удирдамж болон тэдгээрийн дүгнэх шалгуурыг боловсронгуй болгох',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургалтын үнэлгээ талаас:',
            index: 19,
            selected: false,
            description:
              'Богино тест, асуудал шийдэх даалгавруудыг лекц, семинарын төгсгөлд зохион байгуулж хэвших',
          },
          {
            lessonId: this.lessonId,
            categoryChanged: false,
            category: 'Сургалтын үнэлгээ талаас:',
            index: 20,
            selected: false,
            description:
              'CLOs-г үнэлэхэд ашиглаж байгаа рубрикийн шалгуур үзүүлэлтүүд ба тодорхойлогчийг шинэчлэн сайжруулах',
          },
        ];
        this.isNewTask = true;
      }
      this.form = this.fb.group({
        selections: this.fb.array(
          this.tasks.map((task) => new FormControl(task.selected || false))
        ),
      });
      console.log(this.form);
    });
  }

  changeCheckBox() {
    const selectionsArray = this.form.get('selections') as FormArray;

    selectionsArray.controls.forEach((ctrl, index) => {
      ctrl.valueChanges.subscribe((value) => {
        this.tasks[index].selected = value;
      });
    });
  }

  getCheckboxControl(index: number): FormControl {
    return this.taskFormArray.at(index) as FormControl;
  }

  get taskFormArray(): FormArray {
    return this.form.get('selections') as FormArray;
  }

  get selectedTasks() {
    return this.tasks.filter((t) => t.selected);
  }

  onSubmitImprove() {
    if (!this.taskFormArray) {
      console.error('Form not initialized');
      return;
    }

    console.log(this.tasks);
    this.tasks.forEach((task, i) => {
      const control = this.taskFormArray.at(i);
      if (control) {
        task.selected = control.value;
      }
    });

    if (this.isNewTask) {
      this.service.addFeedbackTask(this.tasks).subscribe({
        next: () =>
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          }),
        error: (err) =>
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          }),
      });
    } else {
      this.service.updateFeedbackTask(this.tasks, this.lessonId).subscribe({
        next: () =>
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          }),
        error: (err) =>
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          }),
      });
    }
  }

  submitForm() {
    if (this.feedbackForm.valid) {
      if (this.isNew) {
        this.service.addFeedback(this.feedbackForm.value).subscribe({
          next: () =>
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай хадгалагдлаа!',
            }),
          error: (err) =>
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Алдаа гарлаа: ' + err.message,
            }),
        });
      } else {
        this.service.updateFeedback(this.feedbackForm.value).subscribe({
          next: () =>
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай хадгалагдлаа!',
            }),
          error: (err) =>
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Алдаа гарлаа: ' + err.message,
            }),
        });
      }
    }
  }
}
