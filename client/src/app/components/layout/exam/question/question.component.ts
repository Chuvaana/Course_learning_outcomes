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
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  answerRates = [
    {
      id: '1',
      name: '100%'
    },
    {
      id: '2',
      name: '75%'
    },
    {
      id: '3',
      name: '66%'
    },
    {
      id: '4',
      name: '50%'
    },
    {
      id: '5',
      name: '33%'
    },
    {
      id: '6',
      name: '25%'
    },
    {
      id: '7',
      name: '20%'
    },
    {
      id: '8',
      name: '15%'
    },
    {
      id: '9',
      name: '10%'
    },
    {
      id: '10',
      name: '5%'
    },
    {
      id: '11',
      name: '0%'
    }
  ];
  answers = [
    { answerId: null, answerRate: null}
  ];
  answers1 = [
    { answerId: null, answerRate: null}
  ];

  questionId: any;
  questionName: any;
  questionPoint: any;
  status: any;
  answerId: any;
  answerRate: string[] = [];
  activeIndex: number | undefined = 0;
  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private dialog: MatDialog,
    private router: Router,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.questionForm = this.fb.group({
      id: ['', Validators.required],
      questionType: ['', Validators.required],
      question: ['', Validators.required],
      questionPoint: ['', Validators.required],
      blumLvl: ['', Validators.required],
      cloLvl: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      answer: ['', Validators.required],
      answerRate: this.fb.array([])  // Changed to FormArray for dynamic rates
    });

    // console.log(this.data);
  }
  ngOnInit(): void {
  }

  activeIndexChange(index : number){
      this.activeIndex = index
  }
  valuea(e: any) {
    console.log('asdfasdf');
  }

  onQuestionSelect(){
    this.questionForm.value.answer = this.answerRate;
    console.log(this.questionForm.value);
    console.log(this.answerRate);
    console.log(this.answers);
    console.log(this.answers1);
  }

  onDropdownChange(id: any, selectedId: any) {
    const selectedItem = this.answerRates.find(i => i.id === selectedId.value);
    if (selectedItem) {
      // const idName = 'answerId'+id;
      // // this.answers[id].idName? =
      // // this.answerRate.push(selectedItem.name);
      console.log('Updated answerRate:', this.answerRate);
    }
  }
  onAnswerAdd(){
    this.answers.push({ answerId: null, answerRate: null});
    this.answers1.push({ answerId: null, answerRate: null});
  }
}
