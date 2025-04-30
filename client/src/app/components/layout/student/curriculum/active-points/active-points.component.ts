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
import { MatDialog } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ExamService } from '../../../../../services/examService';
import { TeacherComponent } from '../../../teacher/teacher.component';
import { lessonAssessmentService } from '../../../../../services/lessonAssessment';
import { TableModule } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
interface assessmentList {
  examType: any;
  lessonId: string;
  studentId: string;
  lastName: string;
  firstName: string;
  status: string;
  gmail: string;
}

@Component({
  selector: 'app-active-points',
  standalone: true,
  imports: [
    TableModule,
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './active-points.component.html',
  styleUrls: ['./active-points.component.scss'],
})
export class ActivePointsComponent {
  filteredStudents: assessmentList[] = [];
  studentForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];
  error = 'ERROR';
  fillData: any[] = [];
  lessonId: any;
  searchQuery: string = '';
  selectedLessonType: string = '';
  examType: any = null;
  filterData: any[] = [];
  examList: assessmentList[] = [];
  allExamList: assessmentList[] = [];

  lessonTypes = [
    { id: 'ALEC', name: 'Лекц' },
    { id: 'BSEM', name: 'Семинар' },
    { id: 'CLAB', name: 'Лаборатори' },
  ];
  examTypes = [
    { label: 'Сорил 1', value: 'QUIZ1' },
    { label: 'Сорил 2', value: 'QUIZ2' },
    { label: 'Улирлын шалгалт', value: 'EXAM' },
  ];

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private lessonAssessmentService: lessonAssessmentService
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

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.selectlessonAssessment();
  }

  selectlessonAssessment() {
    this.lessonAssessmentService
      .getLesAssessment(this.lessonId)
      .subscribe((res) => {
        console.log(res);
        this.examList = res;
        this.allExamList = res;
      });
  }
  get questions(): FormArray {
    return this.studentForm.get('questions') as FormArray;
  }

  openPopup() {
    this.dialog.open(TeacherComponent, {
      width: '800px',
      height: '600px',
    });
  }
  loadStudents() {
    if (this.lessonId !== null && this.lessonId !== undefined) {
      this.lessonAssessmentService
        .getLesAssessment(this.lessonId)
        .subscribe((res) => {
          console.log(res);
          this.examList = res;
        });
    }
    this.examType = '';
    this.searchQuery = '';
  }
  examTypesData(selectedType: string) {
    this.examType = selectedType;
    this.applyFilters();
  }

  filterStudents() {
    this.applyFilters();
  }

  applyFilters() {
    this.examList = this.allExamList.filter((exam) => {
      const matchesType = this.examType
        ? exam.examType === this.examType
        : true;
      const matchesSearch = this.searchQuery
        ? exam.lastName
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          exam.firstName
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          exam.status?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          exam.gmail?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          exam.studentId?.toString().includes(this.searchQuery)
        : true;

      return matchesType && matchesSearch;
    });
  }
}
