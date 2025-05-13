import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { CurriculumService } from '../../../../../services/curriculum.service';
import { SharedService } from '../../../../../services/sharedService';

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    PanelModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './main-info.component.html',
  styleUrl: './main-info.component.scss',
})
export class MainInfoComponent {
  @Input() lessonId: string = '';
  isNew: boolean = true;
  branches: any[] = [];
  departments: any[] = [];
  lessonLevel: any[] = [];
  lessonType: any[] = [];
  recommendedSemester: any[] = [];
  teacherId!: string;
  schoolYear!: string;
  lesson: any;

  guaranteeData = {};
  constructor(
    private service: CurriculumService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadBranches();

    this.lessonLevel = [
      { label: 'Бакалавр', value: 'BACHELOR' },
      { label: 'Магистр', value: 'MAGISTER' },
      { label: 'Доктор', value: 'DOCTOR' },
    ];

    this.lessonType = [
      { label: 'Заавал', value: 'REQ' },
      { label: 'Сонгон', value: 'CHO' },
    ];

    this.recommendedSemester = [
      { label: 'Намар', value: 'autumn' },
      { label: 'Хавар', value: 'spring' },
      { label: 'Дурын', value: 'any' },
      { label: 'Өвлийн улирал', value: 'winter' },
      { label: 'Зуны улирал', value: 'summer' },
    ];

    this.sharedService.getConfig('School_year').subscribe((res) => {
      if (res) {
        this.schoolYear = res.itemValue;
      }
    });
    if (this.lessonId) {
      this.readData();
    }
  }

  readData() {
    this.service.getMainInfo(this.lessonId).subscribe((response: any) => {
      if (response) {
        this.lesson = {
          lessonId: this.lessonId,
          lessonName: response.lessonName,
          lessonCode: response.lessonCode,
          lessonCredit: response.lessonCredit,
          school: response.school,
          department: response.department,
          prerequisite: response.prerequisite,

          assistantTeacherName: response.assistantTeacher.name
            ? response.assistantTeacher.name
            : '',
          assistantTeacherRoom: response.assistantTeacher.room
            ? response.assistantTeacher.room
            : '',
          assistantTeacherEmail: response.assistantTeacher.email
            ? response.assistantTeacher.email
            : '',
          assistantTeacherPhone: response.assistantTeacher.phone
            ? response.assistantTeacher.phone
            : '',

          teacherName: response.teacher.name,
          teacherRoom: response.teacher.room,
          teacherEmail: response.teacher.email,
          teacherPhone: response.teacher.phone,

          lessonLevel: response.lessonLevel,
          lessonType: response.lessonType,
          recommendedSemester: response.recommendedSemester,

          weeklyLecture: response.weeklyHours.lecture,
          weeklySeminar: response.weeklyHours.seminar,
          weeklyLab: response.weeklyHours.lab,
          weeklyAssignment: response.weeklyHours.assignment,
          weeklyPractice: response.weeklyHours.practice,

          totalLecture: response.totalHours.lecture,
          totalSeminar: response.totalHours.seminar,
          totalLab: response.totalHours.lab,
          totalAssignment: response.totalHours.assignment,
          totalPractice: response.totalHours.practice,

          selfStudyLecture: response.selfStudyHours.lecture,
          selfStudySeminar: response.selfStudyHours.seminar,
          selfStudyLab: response.selfStudyHours.lab,
          selfStudyAssignment: response.selfStudyHours.assignment,
          selfStudyPractice: response.selfStudyHours.practice,

          createdTeacherBy: response.createdTeacherBy,
          createdTeacherDatetime: response.createdTeacherDatetime,
          checkManagerBy: response.checkManagerBy,
          checkManagerDatetime: response.checkManagerDatetime,
        };
      }
    });
  }

  loadBranches(): void {
    this.service.getBranches().subscribe((data: any[]) => {
      this.branches = data.map((branch) => ({
        name: branch.name,
        id: branch.id || branch.name,
      }));
    });
  }

  onBranchChange(branch: any): void {
    this.service.getDepartments(branch.id).subscribe((data: any[]) => {
      if (data) {
        this.departments = data.map((dept) => ({
          name: dept.name,
          id: dept.id || dept.name,
        }));
      }
    });
  }

  getDepartment(branchId: string, departmentId: string): void {
    this.service.getDepartments(branchId).subscribe((data: any[]) => {
      if (data) {
        this.departments = data
          .filter((dept) => dept.id)
          .map((dept) => ({ name: dept.name, id: dept.id }));

        const selectedDept = this.departments.find(
          (dept) => dept.id === departmentId
        );
        if (selectedDept) {
          // this.mainInfoForm.patchValue({ department: selectedDept });
        }
      }
    });
  }
}
