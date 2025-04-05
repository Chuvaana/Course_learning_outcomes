import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import { ExamService } from '../../../../services/examService';
import { QuestionTypeListComponent } from '../question-type-list/question-type-list.component';
import { QuestionComponent } from '../question/question.component';
import { SplitterModule } from 'primeng/splitter';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PdfExamQuestionService } from '../../../../services/pdf-exam-question.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
    TableModule,
    SplitterModule,
    Checkbox,
    FormsModule,
  ],
  templateUrl: './exam-question-list.component.html',
  styleUrls: ['./exam-question-list.component.scss']
})
export class ExamQuestionListComponent {
  pizza: string[] = [];
  studentForm: FormGroup;
  questionId: any;
  products: any[] = [];
  selectedClos: any[] = [];
  clos: any[] = [];
  lessonId!: string;
  index = 0;
  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private pdfExamQuestionSerivce: PdfExamQuestionService
  ) {
    this.studentForm = this.fb.group({
      id: ['', Validators.required],
      questionType: ['', Validators.required],
      question: ['', Validators.required],
      questionPoint: ['', Validators.required],
      blumLvl: ['', Validators.required],
      cloLvl: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      createdBy: ['', Validators.required]
    });
  }

  // <td>{{ product.order }}</td>
  // <td>{{ product.questionName }}</td>
  // <td>{{ product.blmLevel }}</td>
  // <td>{{ product.CloLevel }}</td>
  // <td>{{ product.questionPoint }}</td>
  // <td>{{ product.createdBy }}</td>
  // <td>{{ product.modifyBy }}</td>
  ngOnInit() {
    this.products = [
      {
        questionId: 'FX-001',
        questionName: 'Программын үндсэн нэр?',
        blmLevel: '2',
        verb: 'Зөв хариулт ол',
        CloLevel: 'CLO 2',
        questionPoint: '5',
        testPart: 1,
        createdBy: 'Unubileg Batbold',
        modifyBy: 'Unubileg Batbold',
      },
      {
        questionId: 'FX-002',
        questionName: 'Хэдэн жил байдаг вэ?',
        blmLevel: '3',
        verb: 'Худлыг ялга',
        CloLevel: 'CLO 5',
        questionPoint: '5',
        testPart: 1,
        createdBy: 'Unubileg Batbold',
        modifyBy: 'Unubileg Batbold',
      },
      {
        questionId: 'FX-003',
        questionName: 'Өвөл',
        blmLevel: '3',
        verb: 'Анализ хийх',
        CloLevel: 'CLO 5',
        questionPoint: '5',
        testPart: 1,
        createdBy: 'Unubileg Batbold',
        modifyBy: 'Unubileg Batbold',
      },
      {
        questionId: 'FX-004',
        questionName: 'Test',
        blmLevel: '3',
        verb: 'Нөхөж бич',
        CloLevel: 'CLO 5',
        questionPoint: '5',
        testPart: 1,
        createdBy: 'Unubileg Batbold',
        modifyBy: 'Unubileg Batbold',
      },
      {
        questionId: 'FX-005',
        questionName: 'Beta',
        blmLevel: '3',
        verb: 'Нөхөж бич',
        CloLevel: 'CLO 5',
        questionPoint: '5',
        testPart: 1,
        createdBy: 'Unubileg Batbold',
        modifyBy: 'Unubileg Batbold',
      },
      {
        questionId: 'FX-006',
        questionName: 'Alpha',
        blmLevel: '3',
        verb: 'Зөв хариулт ол',
        CloLevel: 'CLO 5',
        questionPoint: '5',
        testPart: 1,
        createdBy: 'Unubileg Batbold',
        modifyBy: 'Unubileg Batbold',
      },
      {
        questionId: 'FX-009',
        questionName: 'Alpha',
        blmLevel: '3',
        verb: 'Анализ хийх, дүрслэх',
        CloLevel: 'CLO 5',
        questionPoint: '5',
        testPart: 2,
        createdBy: 'Unubileg Batbold',
        modifyBy: 'Unubileg Batbold',
      }
    ];

    this.route.parent?.paramMap.subscribe(params => {
      this.lessonId = params.get('id')!;
    });

    console.log('Products:', this.products);
    this.loadBranches();
  }
  exportPdf() {
    const data = {
      lessonName: 'Программ хангамж хөгжүүлэлтийн процесс',
      lessonCode: 'CD-121',
      kredit: '3',
      kreditName: 'TEST',
      clos: this.selectedClos,
      testData: this.products,
      teacherName: 'Ж.Алимаа'
    };
    this.pdfExamQuestionSerivce.generatePdf(data);
  }

  loadBranches(): void {
    this.service.getClos().subscribe((data: any[]) => {
      // this.cloCount = data.length;
      this.clos = data;
    });
  }
  onCheckboxClick(clo: any): void {
    const index = this.selectedClos.findIndex((item) => item === clo);

    if (index !== -1) {
      // If already selected, remove it
      this.selectedClos.splice(index, 1);
    } else {
      // If not selected, add it
      this.selectedClos.push(clo);
    }

    console.log('Checkbox clicked:', clo);
    console.log('Selected Clos:', this.selectedClos);
  }

  createBtn() {
    this.dialog.open(QuestionTypeListComponent, {
      width: '60vw',
      height: '50vh',
      maxWidth: 'none'
    });
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, 'table-data');

  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
  editBtn(detailData: any) {
    const dialogRef = this.dialog.open(QuestionComponent, {
      width: '1400px',
      height: '800px',
      maxWidth: 'none',
      data: detailData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result); // Handle the result if needed
    });
  }


}
