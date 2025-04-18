import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-progress-poll',
  imports: [ CommonModule , TextareaModule, CheckboxModule, DropdownModule, InputTextModule, IftaLabelModule, RouterModule, TieredMenuModule, ToastModule, FormsModule ],
  templateUrl: './progress-poll.component.html',
  styleUrl: './progress-poll.component.scss',
})
export class ProgressPollComponent {
  lessonId: string = '';
  items: MenuItem[] | undefined;
  value: string | undefined;
  loading: boolean = false;

  cities: City[] | undefined;

  checked: boolean = false;
  selectedCity: City | undefined;

  answers: { text: string; checked: boolean, value: string }[] = [
    { text: '', checked: false, value : '' }
  ];

  questions: {
    value: string;
    selectedCity: any;
    answers: { text: string; checked: boolean }[];
  }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];

  this.addQuestion();
  }

  load() {
      this.loading = true;

      setTimeout(() => {
          this.loading = false
      }, 2000);
  }

  onAnswerClick(){

  }
  onRemove(answerIndex: number, questionIndex: number) {
    this.questions[questionIndex].answers.splice(answerIndex, 1);
  }

  // Хариултын текст өөрчлөгдөхөд
  onTextInput(answerIndex: number, questionIndex: number) {
    const changedAnswer = this.questions[questionIndex].answers[answerIndex];
    console.log(`Question ${questionIndex}, Answer ${answerIndex}:`, changedAnswer);
  }

  addQuestion() {
    this.questions.push({
      value: '',
      selectedCity: null,
      answers: [
        { text: '', checked: false }
      ]
    });
  }
  addAnswer(questionIndex: number) {
    this.questions[questionIndex].answers.push({ text: '', checked: false });
  }
  // onRemoveAnswer(qIndex: number, answerIndex: number) {
  //   this.questions[qIndex].answers.splice(answerIndex, 1);
  // }
}
