import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CurriculumService } from '../../../../../services/curriculum.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TeacherService } from '../../../../../services/teacherService';
import { Router } from '@angular/router';
import { TabRefreshService } from '../tabRefreshService';
import { SharedService } from '../../../../../services/sharedService';
import { CalendarModule } from 'primeng/calendar';

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
    InputNumberModule,
    CalendarModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './main-info.component.html',
  styleUrl: './main-info.component.scss',
})
export class MainInfoComponent {
  @Input() lessonId: string = '';
  isNew: boolean = true;
  mainInfoForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];
  lessonLevel: any[] = [];
  lessonType: any[] = [];
  recommendedSemester: any[] = [];
  teacherId!: string;
  schoolYear!: string;

  guaranteeData = {};
  constructor(
    private fb: FormBuilder,
    private service: CurriculumService,
    private teacherService: TeacherService,
    private msgService: MessageService,
    private router: Router,
    private tabRefreshService: TabRefreshService,
    private sharedService: SharedService
  ) {
    this.mainInfoForm = this.fb.group({
      lessonId: [],
      lessonName: ['', Validators.required],
      lessonCode: ['', Validators.required],
      lessonCredit: [0, Validators.required],
      school: ['', Validators.required],
      department: ['', Validators.required],
      prerequisite: [''],
      schoolYear: [''],
      association: [''],
      assistantTeacherName: [''],
      assistantTeacherRoom: [''],
      assistantTeacherEmail: [
        '',
        [
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/),
        ],
      ],
      assistantTeacherPhone: ['', [Validators.pattern('^[0-9]+$')]],
      teacherName: ['', Validators.required],
      teacherRoom: ['', Validators.required],
      teacherEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/),
        ],
      ],
      teacherPhone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      lessonLevel: ['', Validators.required],
      lessonType: ['', Validators.required],
      recommendedSemester: ['', Validators.required],
      weeklyLecture: [0, Validators.required],
      weeklySeminar: [0, Validators.required],
      weeklyLab: [0, Validators.required],
      weeklyAssignment: [0, Validators.required],
      weeklyPractice: [0, Validators.required],
      totalLecture: [0, Validators.required],
      totalSeminar: [0, Validators.required],
      totalLab: [0, Validators.required],
      totalAssignment: [0, Validators.required],
      totalPractice: [0, Validators.required],
      selfStudyLecture: [0, Validators.required],
      selfStudySeminar: [0, Validators.required],
      selfStudyLab: [0, Validators.required],
      selfStudyAssignment: [0, Validators.required],
      selfStudyPractice: [0, Validators.required],
      createdTeacherBy: ['', Validators.required],
      createdTeacherDatetime: ['', Validators.required],
      checkManagerBy: ['', Validators.required],
      checkManagerDatetime: [''],
    });

    this.teacherId = (localStorage.getItem('teacherId') as string) || '';
    this.teacherService.getTeacher(this.teacherId).subscribe((res) => {
      this.mainInfoForm.patchValue({
        teacherName: res.name,
        teacherRoom: res.room,
        teacherEmail: res.email,
        teacherPhone: res.phone,
      });
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.mainInfoForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
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
    this.service.getMainInfo(this.lessonId).subscribe(
      (response: any) => {
        if (response) {
          this.isNew = false;
          this.mainInfoForm.patchValue({
            lessonId: this.lessonId,
            lessonName: response.lessonName,
            lessonCode: response.lessonCode,
            lessonCredit: response.lessonCredit,
            school: response.school,
            department: response.department,
            prerequisite: response.prerequisite,
            association: response.association,

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
          });
          let branchName = '';
          if (response.school) {
            this.branches.map((e) => {
              if (e.id === response.school) {
                this.mainInfoForm.patchValue({ school: e });
              }
            });
          }
          if (response.school) {
            this.getDepartment(response.school, response.department);
            console.log(response.department);
            this.departments.map((e: { id: string }) => {
              if (e.id === response.department) {
                this.mainInfoForm.patchValue({ department: e });
              }
            });
          }

          if (response.lessonLevel) {
            this.lessonLevel.map((e) => {
              if (e.value === response.lessonLevel) {
                this.mainInfoForm.patchValue({ lessonLevel: e });
              }
            });
          }
          if (response.lessonType) {
            this.lessonType.map((e) => {
              if (e.value === response.lessonType) {
                this.mainInfoForm.patchValue({ lessonType: e });
              }
            });
          }
          if (response.recommendedSemester) {
            this.recommendedSemester.map((e) => {
              if (e.value === response.recommendedSemester) {
                this.mainInfoForm.patchValue({ recommendedSemester: e });
              }
            });
          }
        }
      },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Алдаа гарлаа: ' + err.error.message,
        });
      }
    );
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
          this.mainInfoForm.patchValue({ department: selectedDept });
        }
      }
    });
  }

  checkData(e: any): boolean {
    const sumSelfStudy =
      e.selfStudyLecture +
      e.selfStudySeminar +
      e.selfStudyLab +
      e.selfStudyAssignment +
      e.selfStudyPractice;

    if (sumSelfStudy != e.lessonCredit * 48) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail:
          'Бие даалтын нийлбэр оноо ' +
          e.lessonCredit * 48 +
          ' байх ёстой. Одоогийн нийлбэр ' +
          sumSelfStudy,
      });
      return false;
    }

    return true;
  }

  submitButton(): void {
    const formData = this.mainInfoForm.value;

    // Convert empty strings to 0 for numeric fields
    const cleanedData = {
      ...formData,
      department: formData.department.id,
      departmentName: formData.department.name,
      school: formData.school.id,
      schoolName: formData.school.name,
      schoolYear: this.schoolYear,
      lessonLevel: formData.lessonLevel.value,
      lessonType: formData.lessonType.value,
      association: formData.association ? formData.association.value : '',
      recommendedSemester: formData.recommendedSemester.value,
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
      totalPractice: Number(formData.totalPractice) || 0,
      selfStudyLecture: Number(formData.selfStudyLecture) || 0,
      selfStudySeminar: Number(formData.selfStudySeminar) || 0,
      selfStudyLab: Number(formData.selfStudyLab) || 0,
      selfStudyAssignment: Number(formData.selfStudyAssignment) || 0,
      selfStudyPractice: Number(formData.selfStudyPractice) || 0,
      createdTeacherBy: String(formData.createdTeacherBy),
      createdTeacherDatetime: new Date(formData.createdTeacherDatetime), // Array хэлбэртэй
      checkManagerBy: String(formData.checkManagerBy), // Array хэлбэртэй
      checkManagerDatetime: new Date(formData.checkManagerDatetime),
    };
    if (!this.checkData(cleanedData)) {
      return;
    }
    if (this.isNew) {
      this.service.saveLesson(cleanedData).subscribe({
        next: (response: any) => {
          const data = {
            lessonId: response.lesson.id,
            teacherId: this.teacherId,
          };
          this.service.addLessonToTeacher(this.teacherId, data).subscribe(
            (res) => {
              this.msgService.add({
                severity: 'success',
                summary: 'Амжилттай',
                detail: 'Амжилттай хадгалагдлаа!',
              });
              this.tabRefreshService.triggerRefresh();
              this.router.navigate([
                '/main/teacher/lesson',
                response.lesson.id,
                'curriculum',
              ]);
            },
            (err) => {
              this.msgService.add({
                severity: 'error',
                summary: 'Алдаа',
                detail: 'Алдаа гарлаа: ' + err.message,
              });
            }
          );
        },
        error: (error) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + error.message,
          });
        },
      });
    } else {
      this.service.updateLesson(this.lessonId, cleanedData).subscribe({
        next: (response) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
          this.readData();
        },
        error: (error) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + error.message,
          });
        },
      });
    }
  }
  onValueChange(e: any) {
    const lecture = e.value || 0;
    this.mainInfoForm.get('totalLecture')?.setValue(lecture * 16);
    this.calculateWeeklyAssignment();
  }

  calculateWeeklyAssignment() {
    const lecture = Number(this.mainInfoForm.get('weeklyLecture')?.value || 0);
    const seminar = Number(this.mainInfoForm.get('weeklySeminar')?.value || 0);
    const lab = Number(this.mainInfoForm.get('weeklyLab')?.value || 0);
    const assignment = lecture * 2 + seminar * 0.5 + lab * 0.5; // жишээ жишгээр

    this.mainInfoForm.get('weeklyAssignment')?.setValue(assignment);
  }

  onValueChangeSem(e: any) {
    this.mainInfoForm.get('totalSeminar')?.setValue(e.value * 16);
    this.calculateWeeklyAssignment();
  }

  onValueChangeLab(e: any) {
    this.mainInfoForm.get('totalLab')?.setValue(e.value * 16);
    this.calculateWeeklyAssignment();
  }

  onValueChangePrac(e: any) {
    this.mainInfoForm.get('totalPractice')?.setValue(e.value * 16);
  }
}
