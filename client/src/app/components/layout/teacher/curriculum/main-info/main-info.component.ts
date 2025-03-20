import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CurriculumService } from '../../../../../services/curriculum.service';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    CommonModule,
    FloatLabel,
    FloatLabelModule,
    InputTextModule,
    InputNumber],
  templateUrl: './main-info.component.html',
  styleUrl: './main-info.component.scss'
})
export class MainInfoComponent {

  mainInfoForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];
  lessonLevel: any[] = [];
  lessonType: any[] = [];
  recommendedSemester: any[] = [];

  constructor(private fb: FormBuilder, private service: CurriculumService) {
    this.mainInfoForm = this.fb.group({
      lessonName: ['', Validators.required],
      lessonCode: ['', Validators.required],
      lessonCredit: ['', Validators.required],
      school: ['', Validators.required],
      department: ['', Validators.required],
      prerequisite: [''],
      assistantTeacherName: ['', Validators.required],
      assistantTeacherRoom: ['', Validators.required],
      assistantTeacherEmail: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/)]],
      assistantTeacherPhone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      teacherName: ['teacher', Validators.required],
      teacherRoom: ['108', Validators.required],
      teacherEmail: ['teacher@must.edu.mn', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/)]],
      teacherPhone: ['89898989', [Validators.required, Validators.pattern('^[0-9]+$')]],
      lessonLevel: ['', Validators.required],
      lessonType: ['', Validators.required],
      recommendedSemester: ['', Validators.required],
      weeklyLecture: ['', Validators.required],
      weeklySeminar: ['', Validators.required],
      weeklyLab: ['', Validators.required],
      weeklyAssignment: ['', Validators.required],
      weeklyPractice: ['', Validators.required],
      totalLecture: ['', Validators.required],
      totalSeminar: ['', Validators.required],
      totalLab: ['', Validators.required],
      totalAssignment: ['', Validators.required],
      selfStudyLecture: ['', Validators.required],
      selfStudySeminar: ['', Validators.required],
      selfStudyLab: ['', Validators.required],
      selfStudyAssignment: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.loadBranches();

    this.lessonLevel = [
      { label: 'Бакалавр', value: 'BACHELOR' },
      { label: 'Магистр', value: 'MAGISTER' },
      { label: 'Доктор', value: 'DOCTOR' },
    ];

    this.lessonType = [
      { label: 'Заавал', value: 'REQ' },
      { label: 'Сонгон', value: 'CHO' }
    ];

    this.recommendedSemester = [
      { label: 'Намар', value: 'LEC_SEM' },
      { label: 'Хавар', value: 'LAB' },
      { label: 'Дурын', value: 'LAB' },
      { label: 'Өвлийн улирал', value: 'LAB' },
      { label: 'Зуны улирал', value: 'LAB' },
    ];
  }


  loadBranches(): void {
    this.service.getBranches().subscribe((data: any[]) => {
      this.branches = data.map(branch => ({ name: branch.name, id: branch.id || branch.name }));
    });
  }

  onBranchChange(branchId: string): void {
    this.service.getDepartments(branchId).subscribe((data: any[]) => {
      if (data) {
        this.departments = data.map(dept => ({ name: dept.name, id: dept.id || dept.name }));
      }
    });
  }

  submitButton(): void {
    const formData = this.mainInfoForm.value;
  
    // Convert empty strings to 0 for numeric fields
    const cleanedData = {
      ...formData,
      lessonCredit: Number(formData.lessonCredit) || 0,
      weeklyLecture: Number(formData.weeklyLecture) || 0,
      weeklySeminar: Number(formData.weeklySeminar) || 0,
      weeklyLab: Number(formData.weeklyLab) || 0,
      weeklyAssignment: Number(formData.weeklyAssignment) || 0,
      weeklyPractice: Number(formData.weeklyPractice) || 0,
      totalLecture: Number(formData.totalLecture) || 0,
      totalSeminar: Number(formData.totalSeminar) || 0,
      totalLab: Number(formData.totalLab) || 0,
      totalAssignment: Number(formData.totalAssignment) || 0,
      selfStudyLecture: Number(formData.selfStudyLecture) || 0,
      selfStudySeminar: Number(formData.selfStudySeminar) || 0,
      selfStudyLab: Number(formData.selfStudyLab) || 0,
      selfStudyAssignment: Number(formData.selfStudyAssignment) || 0,
    };
  
    this.service.saveLesson(cleanedData).subscribe({
      next: (response) => {
        console.log('Lesson saved successfully:', response);
        alert('Lesson saved successfully!');
        this.mainInfoForm.reset();
      },
      error: (error) => {
        console.error('Error saving lesson:', error);
        alert('Error saving lesson.');
      }
    });
  }
  

  // submitButton(): void {
  //   console.log(this.mainInfoForm.value);
  // }

}
