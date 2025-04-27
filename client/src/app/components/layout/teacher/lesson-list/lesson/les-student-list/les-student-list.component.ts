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

interface Student {
  lessonId: string;
  studentCode: string;
  studentName: string;
  lec?: { day?: string; time?: string };
  sem?: { day?: string; time?: string };
  lab?: { day?: string; time?: string };
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

  lessonTypes = [
    { id: 'ALEC', name: 'Лекц' },
    { id: 'BSEM', name: 'Семинар' },
    { id: 'CLAB', name: 'Лаборатори' },
  ];
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
    private route: ActivatedRoute
  ) {}

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
        case 'ALEC':
          return (
            student.lec?.day === week && Number(student.lec?.time) === time
          );
        case 'BSEM':
          return (
            student.sem?.day === week && Number(student.sem?.time) === time
          );
        case 'CLAB':
          return (
            student.lab?.day === week && Number(student.lab?.time) === time
          );
        default:
          return false;
      }
    }
    return true;
  }

  hasLessonType(student: Student, lessonType: string): boolean {
    switch (lessonType) {
      case 'ALEC':
        return !!student.lec?.day;
      case 'BSEM':
        return !!student.sem?.day;
      case 'CLAB':
        return !!student.lab?.day;
      default:
        return false;
    }
  }

  hasSelectedTime(student: Student): boolean {
    const selected = this.selectedTime;

    const timeMatch =
      Number(student.lec?.time) === selected ||
      Number(student.sem?.time) === selected ||
      Number(student.lab?.time) === selected;

    if (!this.selectedWeek) return timeMatch;

    const dayMatch =
      student.lec?.day === this.selectedWeek ||
      student.sem?.day === this.selectedWeek ||
      student.lab?.day === this.selectedWeek;

    return timeMatch && dayMatch;
  }

  hasSelectedWeek(student: Student): boolean {
    const selectedDay = this.selectedWeek;

    return (
      student.lec?.day === selectedDay ||
      student.sem?.day === selectedDay ||
      student.lab?.day === selectedDay
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
  }

  save() {
    this.studentService
      .updateStudents(this.studentSaveDatas)
      .subscribe((res) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай хадгалагдлаа!',
        });
        this.editActive = false;
      });
  }
}
