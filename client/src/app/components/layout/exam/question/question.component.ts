import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ExamService } from '../../../../services/examService';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    TableModule,
    IftaLabelModule,
    InputTextModule,
    FormsModule,
    Editor,
    DropdownModule,
    AccordionModule
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  questionForm: FormGroup;
  value: string | undefined;
  text: string = 'Always bet on Prime!';
  statuss = [
    {
      id: 'READY',
      name: 'Бэлэн'
    },
    {
      id: 'WAIT',
      name: 'Бэлэн болоогүй'
    },
    {
      id: 'UN_READY',
      name: 'Ашиглахаа больсон'
    }
  ];


  questionId: any;
  questionName: any;
  questionPoint: any;
  status: any;
  answerId: any;
  answerRate: any;
  activeIndex: number | undefined = 0;

  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      id: ['', Validators.required],
      questionType: ['', Validators.required],
      question: ['', Validators.required],
      questionPoint: ['', Validators.required],
      blumLvl: ['', Validators.required],
      cloLvl: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }
  ngOnInit(): void {
  }

  activeIndexChange(index : number){
      this.activeIndex = index
  }
  valuea(e: any) {
    console.log('asdfasdf');
  }
}
