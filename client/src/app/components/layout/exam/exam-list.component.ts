import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ExamService } from '../../../services/examService';
import { TeacherComponent } from '../teacher/teacher.component';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss'],
})
export class ExamListComponent {
  studentForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];
  error = 'ERROR';
  fillData: any[] = [];
  data = [
    {
      text: 'Асуулт 1',
      questionType: 'manyCheck',
      answers: ['Хариулт 1', 'Хариулт 2', 'Хариулт 3'],
      selectedAnswers: [],
    },
    {
      text: 'Асуулт 2',
      questionType: 'onlyOneCheck',
      answers: ['Хариулт A', 'Хариулт B', 'Хариулт C'],
      selectedAnswers: [],
    },
    {
      text: 'Асуулт 3',
      questionType: 'relatedQuestion',
      answers: ['Red', 'Blue', 'Green'],
      relatedQuestions: [
        {
          text: 'Why do you like Red?',
          questionType: 'onlyOneCheck',
          answers: ['It looks vibrant', 'It feels powerful'],
        },
        {
          text: 'Why do you like Blue?',
          questionType: 'onlyOneCheck',
          answers: ['It is calming', 'It reminds me of the ocean'],
        },
        {
          text: 'Why do you like Green?',
          questionType: 'onlyOneCheck',
          answers: ['It represents nature', 'It is soothing'],
        },
      ],
    },
  ];
  shownQuestions = [...this.data];

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
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
      createdBy: ['', Validators.required],
    });
  }
  onRefreshData() {}
  createQuestions() {
    return this.data.map((question) =>
      this.fb.group({
        questionText: [question.text, Validators.required],
        answers: this.fb.array(
          question.answers.map((answer) => this.fb.control(false))
        ),
        selectedAnswers: [[]],
      })
    );
  }

  get questions(): FormArray {
    return this.studentForm.get('questions') as FormArray;
  }

  selectQuestionAnswer(
    questionIndex: number,
    answerIndex: number,
    checked: Event
  ) {
    const selectedAnswers = this.data[questionIndex].answers[answerIndex];

    if (checked) {
      this.fillData.map((e) => {
        if (e[0] == questionIndex) {
          const index = this.fillData.findIndex((i) => i[0] === questionIndex);
          if (index !== -1) {
            this.fillData.splice(index, 1);
          }
        }
      });
      const data = [questionIndex, checked, answerIndex];
      this.fillData.push(data);
      console.log(this.fillData);
    } else {
      const index = this.fillData.findIndex((i) => i[0] === questionIndex);
      if (index !== -1) {
        this.fillData.splice(index, 1);
      }
    }
  }

  getSelectedAnswers() {
    this.questions.controls.forEach((questionGroup, index) => {
      console.log(
        `Асуулт ${index + 1}:`,
        questionGroup.get('selectedAnswers')?.value
      );
    });
  }

  onQuestionSelect(e: any) {
    // console.log(e);
  }

  openPopup() {
    this.dialog.open(TeacherComponent, {
      width: '800px',
      height: '600px',
    });
  }
}
