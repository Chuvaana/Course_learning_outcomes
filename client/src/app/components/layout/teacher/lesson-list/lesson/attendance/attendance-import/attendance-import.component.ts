import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService, SelectItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SharedDictService } from '../../../../shared';
import { AttendanceService } from '../../../../../../../services/attendanceService';
import { StudentService } from '../../../../../../../services/studentService';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';

interface AttendanceRecord {
  student: {
    name: string;
    code: string;
    studentId: string;
  };
  attendance: { [weekNumber: string]: boolean }; // Week number as key, attendance status as value
}

@Component({
  selector: 'app-attendance-import',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
    FormsModule,
    CheckboxModule,
    TableModule,
  ],
  providers: [MessageService],
  templateUrl: './attendance-import.component.html',
  styleUrls: ['./attendance-import.component.scss'],
})
export class AttendanceImportComponent {
  studentForm: FormGroup;
  weekdays: SelectItem[] = [];
  classTypes: SelectItem[] = [];

  departments: any[] = [];

  error = 'ERROR';
  active = true;
  firstType = true;
  selectedBranch: string = '';
  filteredDepartments = [];
  onlyEmail: string[] = [];
  studentAllData: string[] = [];
  attendanceRecords: any[] = [];
  tableData: any[][] = [];
  branchId: any;
  lessonId: any;
  students: any[] = [];
  branch = {
    value: 'I',
    label: 'I-р долоо хоног',
  };

  startDate!: Date;

  selectedWeekday: string = 'Monday';
  selectedClassType: 'alec' | 'bsem' | 'clab' = 'alec';
  selectedTimes: number = 1;
  branches = [
    { value: 'I', label: 'I-р долоо хоног' },
    { value: 'II', label: 'II-р долоо хоног' },
    { value: 'III', label: 'III-р долоо хоног' },
    { value: 'IV', label: 'IV-р долоо хоног' },
    { value: 'V', label: 'V-р долоо хоног' },
    { value: 'VI', label: 'VI-р долоо хоног' },
    { value: 'VII', label: 'VII-р долоо хоног' },
    { value: 'VIII', label: 'VIII-р долоо хоног' },
    { value: 'IX', label: 'IX-р долоо хоног' },
    { value: 'X', label: 'X-р долоо хоног' },
    { value: 'XI', label: 'XI-р долоо хоног' },
    { value: 'XII', label: 'XII-р долоо хоног' },
    { value: 'XIII', label: 'XIII-р долоо хоног' },
    { value: 'XIV', label: 'XIV-р долоо хоног' },
    { value: 'XV', label: 'XV-р долоо хоног' },
    { value: 'XVI', label: 'XVI-р долоо хоног' },
  ];

  times = [
    { value: 1, label: '1-р цаг' },
    { value: 2, label: '2-р цаг' },
    { value: 3, label: '3-р цаг' },
    { value: 4, label: '4-р цаг' },
    { value: 5, label: '5-р цаг' },
    { value: 6, label: '6-р цаг' },
    { value: 7, label: '7-р цаг' },
    { value: 8, label: '8-р цаг' },
  ];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private msgService: MessageService,
    private shared: SharedDictService,
    private studentService: StudentService,
    private attendanceService: AttendanceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      branch: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/),
        ],
      ],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.weekdays = [
      { label: 'Даваа', value: 'Monday' },
      { label: 'Мягмар', value: 'Tuesday' },
      { label: 'Лхагва', value: 'Wednesday' },
      { label: 'Пүрэв', value: 'Thursday' },
      { label: 'Баасан', value: 'Friday' },
    ];
    this.loadBranches();
    console.log('popup data.lessonId : ' + this.data.lessonId);

    this.lessonId = this.data.lessonId;

    this.shared.getDictionary(this.lessonId, true).subscribe((res) => {
      this.classTypes = res;

      this.attendanceService
        .getConfig('First_day_of_school')
        .subscribe((res) => {
          if (res) {
            this.startDate = new Date(res.itemValue);
          }
        });
    });
    this.onSelectionChange();
  }

  loadBranches(): void {
    // this.service.getBranches().subscribe((data: any[]) => {
    //   this.branches = data.map((branch) => ({
    //     name: branch.name,
    //     id: branch.id || branch.name,
    //   }));
    // });
  }

  onFileChange(event: any) {
    this.onlyEmail = [];
    const file = event.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, {
        type: 'binary',
      });

      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      this.tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.tableData.map((e: any) => {
        e.splice(0, 1);
      });
      // console.log(this.tableData);
      this.checkData(this.tableData);
    };

    reader.readAsBinaryString(file);
  }

  checkData(data: any) {
    const failedEmails: any[] = [];
    let wrongInData = true;
    data.map((e: any, index: any) => {
      if (index > 0) {
        const email = e[1].toUpperCase();
        const checkEmail = email.slice(10);
        if (checkEmail !== '@MUST.EDU.MN') {
          failedEmails.push(e[1]);
        } else if (checkEmail === '@MUST.EDU.MN') {
          this.onlyEmail.push(email.slice(0, 10));
          wrongInData = false;
        }
      }
    });
    if (wrongInData) {
      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: 'Алдаатай файл оруулсан байна',
      });
      this.tableData = [];
      this.onlyEmail = [];
    }
    if (failedEmails.length > 0 && !wrongInData) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail:
          'Ирцийн оруулсан файлаас дараах оюутны мэйл хаяг алдаатай бичигдсэн байна.' +
          failedEmails,
      });
    }
  }

  openPopup() {}

  submit() {
    if (this.onlyEmail.length > 0) {
      const currentWeek = this.branch.value;
      const lessonId = this.lessonId;

      this.attendanceRecords.forEach((record) => {
        const studentCode = record.student.code;
        if (!(currentWeek in record.attendance)) {
          record.attendance[currentWeek] = this.onlyEmail.includes(studentCode); // true эсвэл false
        }
      });

      const attendanceData = {
        lessonId: lessonId,
        weekDay: this.selectedWeekday,
        type: this.selectedClassType,
        time: this.selectedTimes,
        weekNumber: currentWeek,
        attendance: this.attendanceRecords.map((record) => ({
          studentId: record.student.studentId,
          status: this.onlyEmail.includes(record.student.code), // бүх оюутныг явуулна
        })),
      };

      this.attendanceService.createAttendance(attendanceData).subscribe(
        (response) => {
          this.onSelectionChange();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          });
        },
        (error) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Алдаа гарлаа: ${error.message}`,
          });
        }
      );
    } else {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Ирцийн файл оруулна уу!',
      });
    }
  }

  registerData(e: any) {}

  onChangeBranch(e: any) {
    this.branchId = e.value;
  }

  onSelectionChange(): void {
    this.attendanceService
      .getAttendance(
        this.lessonId,
        this.selectedWeekday,
        this.selectedClassType,
        this.selectedTimes
      )
      .subscribe((res: any) => {
        this.attendanceRecords = this.generateAttendance(res);
        if (this.attendanceRecords.length == 0) {
          this.studentService
            .getStudentByClasstypeAndDayTime(
              this.selectedClassType,
              this.selectedWeekday,
              this.selectedTimes
            )
            .subscribe((students: any[]) => {
              this.students = students;
              this.attendanceRecords = this.generateAttendanceRecords();
            });
        }
      });
  }

  generateAttendance(data: any): AttendanceRecord[] {
    const studentAttendanceMap: { [studentId: string]: AttendanceRecord } = {};

    data.forEach((weekData: any) => {
      weekData.attendance.forEach((item: any) => {
        if (!studentAttendanceMap[item.studentId.id]) {
          studentAttendanceMap[item.studentId.id] = {
            student: {
              name: item.studentId.studentName,
              code: item.studentId.studentCode,
              studentId: item.studentId.id,
            },
            attendance: {},
          };
        }

        studentAttendanceMap[item.studentId.id].attendance[
          weekData.weekNumber
        ] = item.status;
      });
    });

    return Object.values(studentAttendanceMap);
  }
  generateAttendanceRecords() {
    let dates = this.getAllWeeks().sort();
    return this.students.map((student) => ({
      student: {
        name: student.studentName,
        code: student.studentCode,
        studentId: student.id,
      },
      attendance: dates.reduce((acc, date) => ({ ...acc, [date]: false }), {}),
    }));
  }

  getAllWeeks() {
    let today = new Date();

    let diffInTime = today.getTime() - this.startDate.getTime();
    let diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    let currentWeek = Math.floor(diffInDays / 7) + 1;

    let weeks = [];
    for (let week = 1; week <= currentWeek; week++) {
      weeks.push(this.toRoman(week));
    }

    return weeks;
  }

  toRoman(num: number): string {
    const romanNumerals = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'XI',
      'XII',
      'XIII',
      'XIV',
      'XV',
      'XVI',
    ];
    return romanNumerals[num - 1] || '';
  }

  getAttendanceSum(record: AttendanceRecord): number {
    return Object.values(record.attendance).reduce(
      (sum, val) => sum + (val ? 1 : 0),
      0
    );
  }
}
