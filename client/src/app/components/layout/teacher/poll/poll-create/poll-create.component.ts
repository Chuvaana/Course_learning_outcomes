import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { StudentService } from '../../../../../services/studentService';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';

interface Student {
  lessonId: string;
  studentCode: string;
  studentName: string;
  lec?: { day?: string; time?: string };
  sem?: { day?: string; time?: string };
  lab?: { day?: string; time?: string };
}

@Component({
  selector: 'app-poll-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    FloatLabel,
    FloatLabelModule,
    InputNumberModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './poll-create.component.html',
  styleUrl: './poll-create.component.scss',
})
export class PollCreateComponent {
  teacherForm: FormGroup;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchQuery: string = '';
  selectedLessonType: string = '';
  selectedTime: number | null = null;
  selectedWeek: string = '';
  lessonId!: string;

  questionTypes = [
    { id: '1', name: 'Multiple choice' },
    { id: '2', name: 'Checkboxes' },
    { id: '3', name: 'Drop-down' },
    { id: '4', name: 'Linear scale' },
  ];

  timeSlots = Array.from({ length: 8 }, (_, i) => ({
    value: i + 1,
    label: `Цаг ${i + 1}`,
  }));

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {
    this.teacherForm = this.fb.group({
      questionCode: ['', Validators.required],
      questionType: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/),
        ],
      ],
      branch: ['', Validators.required],
      department: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.loadStudents();
  }
  loadStudents(): void {
    this.studentService
      .getStudents(this.lessonId)
      .subscribe((data: Student[]) => {
        this.students = data;
        this.filteredStudents = data;
      });
    this.searchQuery = '';
    (this.selectedTime = null), (this.selectedLessonType = '');
    this.selectedWeek = '';
  }
  addLesson() {}
  get questions(): FormArray {
    return this.teacherForm.get('questions') as FormArray;
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      questionCode: ['', Validators.required],
      questionType: ['', Validators.required],
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }
}
