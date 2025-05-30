import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { StudentService } from '../../../../../../services/studentService';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SharedDictService } from '../../../shared';

interface Student {
  lessonId: string;
  studentCode: string;
  studentName: string;
  alec?: { day?: string; time?: string };
  bsem?: { day?: string; time?: string };
  clab?: { day?: string; time?: string };
}

@Component({
  selector: 'app-les-student-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './les-student-list.component.html',
  styleUrl: './les-student-list.component.scss',
})
export class LesStudentListComponent {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchQuery: string = '';
  selectedLessonType: string = '';
  selectedTime: number | null = null;
  selectedWeek: string = '';
  lessonId!: string;
  editActive = false;
  dataCheckPoint: any;
  studentSaveDatas: any[] = [];

  showLecture = false;
  showSeminar = false;
  showLab = false;

  lessonTypes: any;
  weeks = [
    { name: 'Даваа', id: 'Monday' },
    { name: 'Мягмар', id: 'Tuesday' },
    { name: 'Лхагва', id: 'Wednesday' },
    { name: 'Пүрэв', id: 'Thursday' },
    { name: 'Баасан', id: 'Friday' },
  ];

  timeSlots = Array.from({ length: 8 }, (_, i) => ({
    value: i + 1,
    label: `Цаг ${i + 1}`,
  }));

  constructor(
    private studentService: StudentService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private shared: SharedDictService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.shared.getDictionary(this.lessonId, true).subscribe((res) => {
      this.lessonTypes = res;
      console.log(this.lessonTypes);
      this.setLessonTypeVisibility();
      this.loadStudents();
    });
  }

  setLessonTypeVisibility(): void {
    const values = this.lessonTypes.map((lt: any) => lt.value);
    this.showLecture = values.includes('alec');
    this.showSeminar = values.includes('bsem');
    this.showLab = values.includes('clab');
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

  filterStudents(): void {
    this.filteredStudents = this.students.filter((student) => {
      const matchesSearch =
        !this.searchQuery ||
        student.studentName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        student.studentCode
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesLesson =
        this.selectedLessonType &&
        this.selectedWeek &&
        this.selectedTime !== null &&
        this.checkFullMatch(
          student,
          this.selectedLessonType,
          this.selectedWeek,
          this.selectedTime
        );

      return matchesSearch && matchesLesson;
    });
  }

  checkFullMatch(
    student: Student,
    lessonType: string,
    week: string,
    time: number
  ): boolean {
    if (student && lessonType && week && time) {
      switch (lessonType) {
        case 'alec':
          return (
            student.alec?.day === week && Number(student.alec?.time) === time
          );
        case 'bsem':
          return (
            student.bsem?.day === week && Number(student.bsem?.time) === time
          );
        case 'clab':
          return (
            student.clab?.day === week && Number(student.clab?.time) === time
          );
        default:
          return false;
      }
    }
    return true;
  }

  hasLessonType(student: Student, lessonType: string): boolean {
    switch (lessonType) {
      case 'alec':
        return !!student.alec?.day;
      case 'bsem':
        return !!student.bsem?.day;
      case 'clab':
        return !!student.clab?.day;
      default:
        return false;
    }
  }

  hasSelectedTime(student: Student): boolean {
    const selected = this.selectedTime;

    const timeMatch =
      Number(student.alec?.time) === selected ||
      Number(student.bsem?.time) === selected ||
      Number(student.clab?.time) === selected;

    if (!this.selectedWeek) return timeMatch;

    const dayMatch =
      student.alec?.day === this.selectedWeek ||
      student.bsem?.day === this.selectedWeek ||
      student.clab?.day === this.selectedWeek;

    return timeMatch && dayMatch;
  }

  hasSelectedWeek(student: Student): boolean {
    const selectedDay = this.selectedWeek;

    return (
      student.alec?.day === selectedDay ||
      student.bsem?.day === selectedDay ||
      student.clab?.day === selectedDay
    );
  }

  getDayInMongolian(day: string): string {
    const found = this.weeks.find((w) => w.id === day);
    return found ? found.name : day; // Return the Mongolian name if found, otherwise return the original day
  }
  onWeekChange(data: any) {
    this.students.map((item: any) => {
      if (item.id === data.id) {
        this.studentSaveDatas.push(data);
      }
    });
  }

  edit() {
    this.editActive = true;
    this.dataCheckPoint = this.students;
  }

  cancel() {
    this.editActive = false;
    this.students = this.dataCheckPoint;
    this.filteredStudents = this.students;
    this.loadStudents();
  }

  save() {
    this.filteredStudents.map((e: any) => {
      if (e.id === '') {
        const data = [];
        data.push({
          lessonId: e.lessonId,
          studentCode: e.studentCode,
          studentName: e.studentName,
          lecDay: e.alec.day,
          lecTime: e.alec.time,
          labDay: e.clab.day,
          labTime: e.clab.time,
          semDay: e.bsem.day,
          semTime: e.bsem.time,
        });
        this.studentService.registerLesStudent(data).subscribe((res) => {
          console.log(res);
          // e = re
        });
      }
    });
    this.studentService
      .updateStudents(this.filteredStudents)
      .subscribe((res) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай хадгалагдлаа!',
        });
        this.editActive = false;
      });
  }

  add() {
    let studentData = {
      id: '',
      clab: {
        day: '',
        time: '',
      },
      alec: {
        day: '',
        time: '',
      },
      bsem: {
        day: '',
        time: '',
      },
      lessonId: this.lessonId,
      studentCode: '',
      studentName: '',
    };

    this.filteredStudents.unshift(studentData); // 👈 Add to the beginning
  }

  delete(student: any, rowIndex: any) {
    this.studentService.deleteLesStudents(student.id).subscribe(
      (res: any) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай устгалаа!',
        });
        this.loadStudents();
      },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Устгахад алдаа гарлаа!: ' + err.message,
        });
      }
    );
  }
}
