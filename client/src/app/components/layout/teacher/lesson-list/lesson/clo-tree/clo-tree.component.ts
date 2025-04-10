import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AssessmentService } from '../../../../../../services/assessmentService';
import { ActivatedRoute } from '@angular/router';

type FormAssessment = FormGroup<{
  id: FormControl<string>;
  subMethod: FormControl<string>;
  point: FormControl<number>;
}>;

type FormMethod = FormGroup<{
  id: FormControl<string>;
  methodName: FormControl<string>;
  subMethods: FormArray<FormAssessment>;
}>;

type Form = FormGroup<{
  plans: FormArray<FormMethod>;
}>;

@Component({
  selector: 'app-clo-tree',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: './clo-tree.component.html',
  styleUrl: './clo-tree.component.scss',
})
export class CloTreeComponent {
  constructor(
    private service: AssessmentService,
    private route: ActivatedRoute
  ) {}
  lessonId!: string;
  fb = inject(NonNullableFormBuilder);
  planForm: Form = this.fb.group({
    plans: this.fb.array<FormMethod>([this.generateQuestion()]),
  });

  isNew = false;

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.service.getAssessmentByLesson(this.lessonId).subscribe((res: any) => {
      if (res) {
        const plansArray = this.fb.array<FormMethod>([]);

        res.plans.forEach((plan: any) => {
          const subMethodsArray = this.fb.array<FormAssessment>(
            plan.subMethods.map((sub: any) =>
              this.fb.group({
                id: this.fb.control<string>(sub._id),
                subMethod: this.fb.control<string>(sub.subMethod),
                point: this.fb.control<number>(sub.point),
              })
            )
          );

          const planGroup = this.fb.group({
            id: this.fb.control<string>(plan._id),
            methodName: this.fb.control<string>(plan.methodName),
            subMethods: subMethodsArray,
          });

          plansArray.push(planGroup);
        });

        this.planForm.setControl('plans', plansArray);
        this.isNew = false;
      } else {
        this.isNew = true;
      }
    });
  }

  generateQuestion(): FormMethod {
    return this.fb.group({
      id: '',
      methodName: '',
      subMethods: this.fb.array<FormAssessment>([]),
    });
  }

  addMethod(): void {
    this.planForm.controls.plans.push(this.generateQuestion());
  }

  removeMethod(planIndex: number): void {
    this.planForm.controls.plans.removeAt(planIndex);
  }

  addSubMethod(planIndex: number): void {
    const newAnswer: FormAssessment = this.fb.group({
      id: '',
      subMethod: '',
      point: 0,
    });
    this.planForm.controls.plans
      .at(planIndex)
      ?.controls?.subMethods?.push(newAnswer);
  }

  removeSubMethod(planIndex: number, answerIndex: number): void {
    this.planForm.controls.plans
      .at(planIndex)
      ?.controls?.subMethods?.removeAt(answerIndex);
  }

  onSubmit() {
    console.log(this.planForm.getRawValue());
    const formData = this.planForm.getRawValue();
    const payload = formData.plans.map((plan) => ({
      id: plan.id, // Include plan id
      methodName: plan.methodName,
      subMethods: plan.subMethods.map((sub) => ({
        id: sub.id, // Include subMethod id
        subMethod: sub.subMethod,
        point: sub.point,
      })),
    }));

    if (this.isNew) {
      this.service
        .saveAssessmentMethod({ plans: payload, lessonId: this.lessonId })
        .subscribe((res) => {
          console.log('Амжилттай хадгалагдлаа!', res);
        });
    } else {
      this.service
        .updateAssessmentMethod(this.lessonId, {
          plans: payload,
          lessonId: this.lessonId,
        })
        .subscribe((res) => {
          console.log('Амжилттай шинэчлэгдлээ!', res);
        });
    }
  }
}
