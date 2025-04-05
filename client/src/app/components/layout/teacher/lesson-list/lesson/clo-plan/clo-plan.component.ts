import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver'; // file-saver сан
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import { CLOService } from '../../../../../../services/cloService';
import { PdfCloGeneratorService } from '../../../../../../services/pdf-clo-generator.service';
import { PdfGeneratorService } from '../../../../../../services/pdf-generator.service';
import { TeacherService } from '../../../../../../services/teacherService';

@Component({
  selector: 'app-clo-plan',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumber,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './clo-plan.component.html',
  styleUrl: './clo-plan.component.scss',
})
export class CloPlanComponent {
  cloForm!: FormGroup;
  sampleData!: any;
  cloList!: any;
  pointPlan!: any;
  cloPlan!: any;
  isUpdate: boolean = false;
  lessonId!: string;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: TeacherService,
    private cloService: CLOService,
    private pdfService: PdfGeneratorService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private pdfCloService: PdfCloGeneratorService
  ) {}

  async ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
      console.log('Lesson ID:', this.lessonId);
    });

    this.cloForm = this.fb.group({
      cloRows: this.fb.array([]),
    });

    await this.readData();
  }

  async readData() {
    this.isLoading = true;

    await forkJoin([
      this.service.getCloList(this.lessonId),
      this.cloService.getPointPlan(this.lessonId),
      this.cloService.getCloPlan(this.lessonId),
    ]).subscribe(([cloList, pointPlan, cloPlan]) => {
      this.cloList = cloList;
      this.pointPlan = pointPlan || {
        timeManagement: 0,
        engagement: 0,
        recall: 0,
        problemSolving: 0,
        recall2: 0,
        problemSolving2: 0,
        toExp: 0,
        processing: 0,
        decisionMaking: 0,
        formulation: 0,
        analysis: 0,
        implementation: 0,
        understandingLevel: 0,
        analysisLevel: 0,
        creationLevel: 0,
      };

      this.cloPlan = cloPlan;
      // if ((Array.isArray(this.cloPlan[0]) && this.cloPlan[0].length === 0)) {
      //   this.cloPlan[0] = [this.pointPlan];
      // }
      if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
        this.createRows();
        this.isLoading = false;
      } else {
        this.populateCLOForm();
        this.isUpdate = true;
        this.isLoading = false;
      }
    });
  }

  get cloRows(): FormArray {
    return this.cloForm.get('cloRows') as FormArray;
  }

  getRowGroup(index: number): FormGroup {
    return this.cloRows.at(index) as FormGroup;
  }

  createRows() {
    this.sampleData = [
      [
        this.pointPlan, // Ensure this is an array
      ],
      this.cloList.map((clo: any) => ({
        id: '',
        cloId: clo.id,
        cloName: clo.cloName,
        cloType: clo.type,
        lessonId: this.lessonId,
        timeManagement: 0,
        engagement: 0,
        recall: 0,
        problemSolving: 0,
        recall2: 0,
        problemSolving2: 0,
        toExp: 0,
        processing: 0,
        decisionMaking: 0,
        formulation: 0,
        analysis: 0,
        implementation: 0,
        understandingLevel: 0,
        analysisLevel: 0,
        creationLevel: 0,
      })),
    ];
    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(
        this.fb.group({
          id: [data.id],
          lessonId: [data.lessonId],
          cloId: [data.cloId],
          cloName: [data.cloName],
          cloType: [data.cloType],
          timeManagement: [data.timeManagement],
          engagement: [data.engagement],
          recall: [data.recall],
          problemSolving: [data.problemSolving],
          recall2: [data.recall2],
          problemSolving2: [data.problemSolving2],
          toExp: [data.toExp],
          processing: [data.processing],
          decisionMaking: [data.decisionMaking],
          formulation: [data.formulation],
          analysis: [data.analysis],
          implementation: [data.implementation],
          understandingLevel: [data.understandingLevel],
          analysisLevel: [data.analysisLevel],
          creationLevel: [data.creationLevel],
        })
      );
    });
  }

  populateCLOForm() {
    this.sampleData = [[this.pointPlan], this.cloPlan];

    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(
        this.fb.group({
          id: [data.id],
          lessonId: [data.lessonId],
          cloId: [data.cloId],
          cloName: [data.cloName],
          cloType: [data.cloType],
          timeManagement: [data.timeManagement],
          engagement: [data.engagement],
          recall: [data.recall],
          problemSolving: [data.problemSolving],
          recall2: [data.recall2],
          problemSolving2: [data.problemSolving2],
          toExp: [data.toExp],
          processing: [data.processing],
          decisionMaking: [data.decisionMaking],
          formulation: [data.formulation],
          analysis: [data.analysis],
          implementation: [data.implementation],
          understandingLevel: [data.understandingLevel],
          analysisLevel: [data.analysisLevel],
          creationLevel: [data.creationLevel],
        })
      );
    });
  }

  validateColumnTotals(): boolean {
    const columnNames: Record<string, string> = {
      timeManagement: 'Цаг төлөвлөлт, хариуцлага',
      engagement: 'Суралцах хүсэл эрмэлзэл, өөрийгээ илэрхийлэх',
      recall: 'Сорил 1: Мэдлэгээ сэргээн санах, тайлбарлах',
      problemSolving:
        'Сорил 1: Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх',
      recall2: 'Сорил 2: Мэдлэгээ сэргээн санах, тайлбарлах',
      problemSolving2:
        'Сорил 2: Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх',
      toExp: 'Лабораторийн хэмжилт, туршилт, даалгавар гүйцэтгэх',
      processing:
        'Үр дүнг тохирох аргаар өгөгдсөн форматын дагуу боловсруулж, тайлагнах',
      decisionMaking:
        'Өгөгдсөн даалгаварын хүрээнд шийдвэрлэх асуудлаа тодорхойлж томъёолох',
      formulation:
        'Шийдвэрлэх асуудлын хүрээнд тодорхой шийдэл дэвшүүлэх, дүн шинжилгээ хийх',
      analysis:
        'Мэдлэг, ур чадвараа ашиглан сонгосон шийдлын дагуу асуудлыг шийдвэрлэх',
      implementation:
        'Бичгийн болон харилцах ур чадвараа ашиглан үр дүнг өгөгдсөн форматын дагуу тайлагнах, илтгэх',
      understandingLevel: 'Сэргээн санах/ойлгох түвшин',
      analysisLevel: 'Хэрэглэх /дүн шинжилгээ хийх түвшин',
      creationLevel: 'Үнэлэх/ бүтээх түвшин',
    };

    let isValid = true;

    Object.keys(columnNames).forEach((column) => {
      const expectedTotal =
        this.pointPlan && this.pointPlan && this.pointPlan[column] !== undefined
          ? this.pointPlan[column]
          : 0;

      let actualTotal = 0;

      this.cloRows.controls.forEach((row) => {
        actualTotal += row.get(column)?.value || 0;
      });

      const columnName = columnNames[column]; // Монгол нэрийг авах

      if (actualTotal > expectedTotal) {
        this.msgService.add({
          severity: 'warn',
          summary: 'Анхааруулга',
          detail: `${columnName} баганын нийт оноо (${actualTotal}) хэтэрсэн!`,
        });
        isValid = false;
      } else if (actualTotal < expectedTotal) {
        this.msgService.add({
          severity: 'warn',
          summary: 'Анхааруулга',
          detail: `${columnName} баганын нийт оноо (${actualTotal}) хүрэлцэхгүй байна!`,
        });
        isValid = false;
      }
    });

    return isValid;
  }

  onSubmit() {
    if (this.validateColumnTotals()) {
      const formData = this.cloForm.value.cloRows;
      const request = this.isUpdate
        ? this.cloService.updateCloPlan(formData)
        : this.cloService.saveCloPlan(formData);
      request.subscribe(
        () =>
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          }),
        (err) =>
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Алдаа гарлаа: ${err.message}`,
          })
      );
    }
  }

  exportToExcel() {
    // Дата-г worksheet болгон хөрвүүлэх
    let excelData = [];
    let conver: any;
    let count;
    for (let i = 0; i < this.sampleData.length; i++) {
      if (i == 0) {
        conver = this.sampleData[i][0];
        console.log(conver[0]);
        excelData.push(conver[0]);
      } else if (i == 1) {
        this.sampleData[1].map((e: any) => {
          excelData.push(e);
        });
      }
    }
    console.log(excelData);
    // if(this.sampleData){
    // Массивийн эхний талбар үндсэн оноо

    // Массивийн 2 дахь талбар CLO буюу дүнгийн задаргаа оноо байна

    // }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // Workbook үүсгэх
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Excel файлыг binary болгон хөрвүүлэх
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Файлыг хадгалах
    this.saveAsExcelFile(excelBuffer, 'table-data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
  generate() {
    let excelData: any[] = [];
    let conver: any;
    let count;
    // const header = Object.keys(this.sampleData[0][0][0]);
    // excelData.push(header);
    // console.log(excelData);
    for (let i = 0; i < this.sampleData.length; i++) {
      if (i == 1) {
        this.sampleData[1].map((e: any) => {
          excelData.push(Object.keys(e));
        });
      }
      //   if (i == 0) {
      //     const header = Object.keys(this.sampleData[0][0][0]);
      //     excelData.push(header);
      //     // conver = this.sampleData[i][0];
      //     // console.log(conver[0]);
      //     // excelData.push(Object.keys(conver[0]));
      //   } else if (i == 1) {
      //     this.sampleData[1].map((e: any) => {
      //       excelData.push(Object.keys(e));
      //     })
      //   }
    }
    console.log(excelData);
    this.pdfCloService.generatePdf(excelData);
  }
}
