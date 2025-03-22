import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ExamService } from '../../../../services/examService';
import { TeacherComponent } from '../../teacher/teacher.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { QuestionTypeListComponent } from '../question-type-list/question-type-list.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'; // file-saver сан

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
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {  // Fixed the typo here
  studentForm: FormGroup;
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private dialog: MatDialog
  ) {
    this.studentForm = this.fb.group({
      id: ['', Validators.required],
      questionType: ['', Validators.required],
      question: ['', Validators.required],
      questionPoint: ['', Validators.required],
      blumLvl: ['', Validators.required],
      cloLvl: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required],
      answer4: ['', Validators.required],
      answer5: ['', Validators.required],
      answer6: ['', Validators.required],
      answer7: ['', Validators.required],
      answer8: ['', Validators.required],
      createdBy: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.products = [
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5,
      },
      {
        id: '2',
        code: '1f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5,
      }
    ];
    console.log('Products:', this.products);
  }

  createBtn() {
    this.dialog.open(QuestionTypeListComponent, {
      width: '60vw', // 80% of the viewport width
      height: '50vh', // 50% of the viewport height,
      maxWidth: 'none'
    });
  }

  exportToExcel(){
    // Дата-г worksheet болгон хөрвүүлэх
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);

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
}
