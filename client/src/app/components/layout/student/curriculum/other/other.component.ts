import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { OtherService } from '../../../../../services/other.service';

@Component({
  selector: 'app-other',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    FloatLabelModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './other.component.html',
  styleUrl: './other.component.scss',
})
export class OtherComponent {
  @Input() lessonId: string = '';

  otherForm!: FormGroup;
  isNew = true;

  constructor(private fb: FormBuilder, private service: OtherService) {}

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
}
