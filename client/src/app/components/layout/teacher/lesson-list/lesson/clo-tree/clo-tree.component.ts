import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AssessmentService } from '../../../../../../services/assessmentService';

type FormAssessment = FormGroup<{
  id: FormControl<string>;
  subMethod: FormControl<string>;
  point: FormControl<number>;
}>;

type FormMethod = FormGroup<{
  id: FormControl<string>;
  methodName: FormControl<string>;
  methodType: FormControl<string>;
  secondMethodType: FormControl<string>;
  frequency: FormControl<number>;
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
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './clo-tree.component.html',
  styleUrl: './clo-tree.component.scss',
})
export class CloTreeComponent {
  constructor(
    private service: AssessmentService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private cd: ChangeDetectorRef
  ) {}
  lessonId!: string;
  fb = inject(NonNullableFormBuilder);
  planForm: Form = this.fb.group({
    plans: this.fb.array<FormMethod>([this.generateQuestion()]),
  });

  isNew = false;
  hideArray: boolean[] = [];

  methodTypes = [
    { value: 'EXAM', label: 'Шалгалт' },
    { value: 'QUIZ1', label: 'Сорил 1' },
    { value: 'QUIZ2', label: 'Сорил 2' },
    { value: 'PARTI', label: 'Ирц, идэвх' },
    { value: 'PROC', label: 'Явц' },
  ];
  secondMethodTypes = [
    { value: 'CLAB', label: 'Лаборатори' },
    { value: 'BSEM', label: 'Семинар' },
    { value: 'BD', label: 'Бие даалт' },
  ];

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.service.getAssessmentByLesson(this.lessonId).subscribe((res: any) => {
      if (JSON.stringify(res) !== '{}') {
        const plansArray = this.fb.array<FormMethod>([]);

        res.plans.forEach((plan: any, index: number) => {
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
            methodType: this.fb.control<string>(plan.methodType || ' '),
            secondMethodType: this.fb.control<string>(
              plan.secondMethodType || ' '
            ),
            frequency: this.fb.control<number>(plan.frequency),
            subMethods: subMethodsArray,
          });

          plansArray.push(planGroup);
          this.hideArray[index] = plan.methodType === 'PROC';

          // ✅ Optional: react to user changes too
          planGroup.get('methodType')?.valueChanges.subscribe((value) => {
            this.hideArray[index] = value === 'PROC';
          });
        });

        this.planForm.setControl('plans', plansArray);

        this.isNew = false;
      } else {
        this.getDefaultValue();
        this.isNew = true;
      }
    });
  }

  changedMethodType(event: DropdownChangeEvent, index: number) {
    this.hideArray[index] = event.value === 'PROC';
  }

  getDefaultValue() {
    const plansArray = this.fb.array<FormMethod>([]);

    const res = {
      _id: '',
      lessonId: this.lessonId,
      plans: [
        {
          methodName: 'Хичээлийн идэвх, оролцоо',
          methodType: 'PARTI',
          frequency: 16,
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
          methodType: 'QUIZ1',
          frequency: 1,
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
          methodType: 'QUIZ2',
          frequency: 1,
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
          secondMethodType: 'CLAB',
          frequency: 3,
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
          frequency: 1,
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
        secondMethodType: this.fb.control<string>(plan.secondMethodType),
        frequency: this.fb.control<number>(plan.frequency),
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
      methodType: '',
      secondMethodType: '',
      frequency: 0,
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
    const planGroup = this.planForm.get('plans') as FormArray;
    const subMethodsControl = planGroup.at(planIndex).get('subMethods');

    if (subMethodsControl instanceof FormArray) {
      console.log('Before remove:', subMethodsControl.value);
      subMethodsControl.removeAt(answerIndex);
      console.log('After remove:', subMethodsControl.value);
    } else {
      console.error('subMethods is not a FormArray', subMethodsControl);
    }

    this.cd.detectChanges();
  }

  trackByIndex(index: number, _: any): number {
    return index;
  }

  checkSum(data: any): number {
    let sum = 0;

    data.map((element: any) => {
      if (element.methodType !== 'EXAM') {
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
      secondMethodType: plan?.secondMethodType,
      frequency: plan.frequency,
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
