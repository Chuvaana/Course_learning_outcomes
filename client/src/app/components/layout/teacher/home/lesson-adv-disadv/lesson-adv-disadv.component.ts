import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
  ],
  providers: [MessageService],
  templateUrl: './lesson-adv-disadv.component.html',
  styleUrl: './lesson-adv-disadv.component.scss',
})
export class LessonAdvDisadvComponent {
  @Input() lessonId!: string;
  feedbackForm: FormGroup;
  isNew = false;

  constructor(
    private fb: FormBuilder,
    private service: FeedbackService,
    private msgService: MessageService
  ) {
    this.feedbackForm = this.fb.group({
      lessonId: ['', Validators.required],
      strengths: ['', Validators.required],
      weaknesses: ['', Validators.required],
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
        });
        this.isNew = false;
      } else {
        this.isNew = true;
        this.feedbackForm.get('lessonId')?.setValue(this.lessonId);
      }
    });
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
