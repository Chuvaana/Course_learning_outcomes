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
  teacherId!: string;
  schoolYear!: string;
  lesson = {
    lessonId: '',
    lessonName: '',
    lessonCode: '',
    lessonCredit: 0,
    school: '',
    department: '',
    prerequisite: '',

    assistantTeacherName: '',
    assistantTeacherRoom: '',
    assistantTeacherEmail: '',
    assistantTeacherPhone: '',

    teacherName: '',
    teacherRoom: '',
    teacherEmail: '',
    teacherPhone: 0,

    lessonLevel: '',
    lessonType: '',
    recommendedSemester: '',

    weeklyLecture: 0,
    weeklySeminar: 0,
    weeklyLab: 0,
    weeklyAssignment: 0,
    weeklyPractice: 0,

    totalLecture: 0,
    totalSeminar: 0,
    totalLab: 0,
    totalAssignment: 0,
    totalPractice: 0,

    selfStudyLecture: 0,
    selfStudySeminar: 0,
    selfStudyLab: 0,
    selfStudyAssignment: 0,
    selfStudyPractice: 0,

    createdTeacherBy: 0,
    createdTeacherDatetime: new Date(),
    checkManagerBy: 0,
    checkManagerDatetime: new Date(),
  };

  guaranteeData = {};
  constructor(
    private service: CurriculumService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadBranches();

    this.sharedService.getConfig('School_year').subscribe((res) => {
      if (res) {
        this.schoolYear = res.itemValue;
      }
    });
    if (this.lessonId) {
      this.readData();
    }
  }

  getSemesterName(e: string): string {
    switch (e) {
      case 'autumn':
        return 'Намар';
      case 'spring':
        return 'Хавар';
      case 'any':
        return 'Дурын';
      case 'Өвлийн улирал':
        return 'winter';
      case 'Зуны улирал':
        return 'summer';
      default:
        return '';
    }
  }

  getLessonLevelName(e: string): string {
    switch (e) {
      case 'BACHELOR':
        return 'Бакалавр';
      case 'MAGISTER':
        return 'Магистр';
      case 'DOCTOR':
        return 'Доктор';
      default:
        return '';
    }
  }

  getLessonTypeName(e: string): string {
    switch (e) {
      case 'REQ':
        return 'Заавал';
      case 'CHO':
        return 'Сонгон';
      default:
        return '';
    }
  }

  readData() {
    this.service.getMainInfo(this.lessonId).subscribe((response: any) => {
      if (response) {
        this.lesson = {
          lessonId: this.lessonId,
          lessonName: response.lessonName || '',
          lessonCode: response.lessonCode || '',
          lessonCredit: response.lessonCredit || 0,
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
          createdTeacherDatetime: new Date(response.createdTeacherDatetime),
          checkManagerBy: response.checkManagerBy,
          checkManagerDatetime: new Date(response.checkManagerDatetime),
        };
        if (response.school) {
          this.service
            .getDepartments(response.school)
            .subscribe((departments: any[]) => {
              this.departments = departments.map((dept) => ({
                name: dept.name,
                id: dept.id || dept.name,
              }));

              const selectedBranch = this.branches.find(
                (b) => b.id === response.school
              );
              if (selectedBranch) {
                this.lesson.school = selectedBranch.name;
                const selectedDept = this.departments.find(
                  (d) => d.id === response.department
                );
                if (selectedDept) {
                  this.lesson.department = selectedDept.name;
                }
              }
            });
        }
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
}
