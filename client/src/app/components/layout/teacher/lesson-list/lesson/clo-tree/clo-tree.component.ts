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
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

type FormAssessment = FormGroup<{
  id: FormControl<string>;
  subMethod: FormControl<string>;
  point: FormControl<number>;
}>;

type FormMethod = FormGroup<{
  id: FormControl<string>;
  methodName: FormControl<string>;
  methodType: FormControl<string>;
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
    FloatLabelModule,
    ToastModule,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './clo-tree.component.html',
  styleUrl: './clo-tree.component.scss',
})
export class CloTreeComponent {
  constructor(
    private service: AssessmentService,
    private route: ActivatedRoute,
    private msgService: MessageService
  ) {}
  lessonId!: string;
  fb = inject(NonNullableFormBuilder);
  planForm: Form = this.fb.group({
    plans: this.fb.array<FormMethod>([this.generateQuestion()]),
  });

  isNew = false;

  methodTypes = [
    { id: 'EXAM', name: 'Шалгалт' },
    { id: 'PROC', name: 'Явц' },
  ];

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.service.getAssessmentByLesson(this.lessonId).subscribe((res: any) => {
      if (JSON.stringify(res) !== '{}') {
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
            methodType: this.fb.control<string>(plan.methodType),
            subMethods: subMethodsArray,
          });

          plansArray.push(planGroup);
        });

        this.planForm.setControl('plans', plansArray);
        this.isNew = false;
      } else {
        this.getDefaultValue();
        this.isNew = true;
      }
    });
  }

  getDefaultValue() {
    const plansArray = this.fb.array<FormMethod>([]);

    const res = {
      _id: '',
      lessonId: this.lessonId,
      plans: [
        {
          methodName: 'Хичээлийн идэвх, оролцоо',
          methodType: 'PROC',
          subMethods: [
            {
              _id: '',
              subMethod: 'Цаг төлөвлөлт, хариуцлага',
              point: 5,
            },
            {
              _id: '',
              subMethod: 'Суралцах хүсэл эрмэлзэл, өөрийгөө илэрхийлэх',
              point: 5,
            },
          ],
          _id: '',
        },
        {
          methodName: 'Явцын сорил 1',
          methodType: 'PROC',
          subMethods: [
            {
              _id: '',
              subMethod: 'Мэдлэгээ сэргээн санах, тайлбарлах',
              point: 5,
            },
            {
              _id: '',
              subMethod:
                'Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шижлэх',
              point: 5,
            },
          ],
          _id: '',
        },
        {
          methodName: 'Явцын сорил 2',
          methodType: 'PROC',
          subMethods: [
            {
              _id: '',
              subMethod: 'Мэдлэгээ сэргээн санах, тайлбарлах',
              point: 5,
            },
            {
              _id: '',
              subMethod:
                'Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шижлэх',
              point: 5,
            },
          ],
          _id: '',
        },
        {
          methodName: 'Лабораторийн ажил, туршилт',
          methodType: 'PROC',
          subMethods: [
            {
              _id: '',
              subMethod: 'Лабораторийн хэмжилт, туршилт, даалгавар гүйцэтгэх',
              point: 5,
            },
            {
              _id: '',
              subMethod:
                'Үр дүнг тохирох аргаар өгөгдсөн форматын дагуу боловсруулж, тайлагнах',
              point: 5,
            },
          ],
          _id: '',
        },
        {
          methodName: 'Улирлын шалгалт',
          methodType: 'EXAM',
          subMethods: [
            {
              _id: '',
              subMethod: 'Сэргээн санах/ойлгох түвшин',
              point: 5,
            },
            {
              _id: '',
              subMethod: 'Хэрэглэх /дүн шинжилгээ хийх түвшин',
              point: 10,
            },
            {
              _id: '',
              subMethod: 'Үнэлэх/ бүтээх түвшин',
              point: 15,
            },
          ],
          _id: '',
        },
      ],
      __v: 0,
    };

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
        methodType: this.fb.control<string>(plan.methodType),
        subMethods: subMethodsArray,
      });

      plansArray.push(planGroup);
    });

    this.planForm.setControl('plans', plansArray);
  }

  generateQuestion(): FormMethod {
    return this.fb.group({
      id: '',
      methodName: '',
      methodType: 'PROC',
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

  checkSum(data: any): number {
    let sum = 0;

    data.map((element: any) => {
      if (element.methodType === 'PROC') {
        element.subMethods.map((item: any) => {
          sum += item.point;
        });
      }
    });
    return sum;
  }

  checkExamSum(data: any): number {
    let sum = 0;
    data.map((element: any) => {
      if (element.methodType === 'EXAM') {
        element.subMethods.map((item: any) => {
          sum += item.point;
        });
      }
    });
    return sum;
  }

  onSubmit() {
    console.log(this.planForm.getRawValue());
    const formData = this.planForm.getRawValue();
    const payload = formData.plans.map((plan) => ({
      id: plan.id, // Include plan id
      methodName: plan.methodName,
      methodType: plan.methodType,
      subMethods: plan.subMethods.map((sub) => ({
        id: sub.id, // Include subMethod id
        subMethod: sub.subMethod,
        point: sub.point,
      })),
    }));

    const sumPoint = this.checkSum(payload);
    if (sumPoint !== 70) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Явцын нийлбэр оноо 70 байх ёстой. Одоогийн нийлбэр: ${sumPoint}`,
      });
      return;
    }
    const sumExamPoint = this.checkExamSum(payload);
    if (sumExamPoint !== 30) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Шалгалтын нийлбэр оноо 30 байх ёстой. Одоогийн нийлбэр: ${sumExamPoint}`,
      });
      return;
    }

    if (this.isNew) {
      this.service
        .saveAssessmentMethod({ plans: payload, lessonId: this.lessonId })
        .subscribe((res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          });
        });
    } else {
      this.service
        .updateAssessmentMethod(this.lessonId, {
          plans: payload,
          lessonId: this.lessonId,
        })
        .subscribe((res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай шинэчлэгдлээ',
          });
        });
    }
  }
}
