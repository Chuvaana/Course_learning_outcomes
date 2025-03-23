import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AdditionalService } from '../../../../../services/additionalService';

@Component({
  selector: 'app-additional',
  standalone: true,
  imports: [ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    ToastModule],
  providers: [MessageService],
  templateUrl: './additional.component.html',
  styleUrl: './additional.component.scss'
})
export class AdditionalComponent {
  @Input() lessonId: string = '';
  additionalForm!: FormGroup;
  isNew = true;

  constructor(private fb: FormBuilder, private service: AdditionalService, private msgService: MessageService) {
    this.additionalForm = this.fb.group({
      lessonId: this.lessonId,
      additional: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.lessonId) {
      this.readData(this.lessonId);
    } else {
      this.addAdditional();
    }
  }

  readData(id: string) {
    this.service.getAdditional(id).subscribe((res: any) => {
      if (res && res.length != 0) {
        this.isNew = false;
        this.additionalForm.patchValue({
          lessonId: res.lessonId
        });
        this.additional.clear();
        res.additional.forEach((add: string) => {
          this.additional.push(this.fb.control(add, Validators.required));
        });
      }
    },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      });
  }

  addAdditional() {
    this.additional.push(this.fb.control('', Validators.required));
  }

  get additional() {
    return this.additionalForm.get('additional') as FormArray;
  }

  removeAdditional(index: number) {
    this.additional.removeAt(index);
  }
  onSubmit() {
    const formData = {
      lessonId: this.lessonId,  // Make sure `lessonId` is included in the data
      additional: this.additional.value,
    };

    if (this.isNew) {
      this.service.addAdditional(formData).subscribe((res: any) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай хадгалагдлаа!',
        });
        this.additionalForm.patchValue({
          additional: res.material.additional,
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
      this.service.updateAdditional(this.lessonId, formData).subscribe(
        (res: any) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
          this.additionalForm.patchValue({
            additional: res.material.additional,
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
