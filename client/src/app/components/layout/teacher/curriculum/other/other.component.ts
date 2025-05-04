import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { OtherService } from '../../../../../services/other.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-other',
  standalone: true,
  imports: [
    ToastModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    FloatLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './other.component.html',
  styleUrl: './other.component.scss',
})
export class OtherComponent {
  @Input() lessonId: string = '';

  otherForm!: FormGroup;
  isNew = true;

  constructor(
    private fb: FormBuilder,
    private service: OtherService,
    private msgService: MessageService
  ) {}

  ngOnInit() {
    this.otherForm = this.fb.group({
      lessonId: [this.lessonId],
      description: ['', Validators.required],
      goal: ['', Validators.required],
    });
    if (this.lessonId) {
      this.service.getDefinition(this.lessonId).subscribe((res: any) => {
        if (res != null && res.length != 0) {
          res = res[0];
          this.isNew = false;
          this.otherForm.patchValue({
            lessonId: res.lessonId,
            description: res.description,
            goal: res.goal,
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.otherForm.valid) {
      if (this.isNew) {
        this.service.addDefinition(this.otherForm.value).subscribe(
          (res: any) => {
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
          .updateDefinition(this.lessonId, this.otherForm.value)
          .subscribe(
            (res: any) => {
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
    } else {
      console.log('Форм буруу байна');
    }
  }
}
