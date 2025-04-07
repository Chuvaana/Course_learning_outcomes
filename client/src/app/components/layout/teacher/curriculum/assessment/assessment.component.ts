import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AssessmentService } from '../../../../../services/assessmentService';
import { TabRefreshService } from '../tabRefreshService';
import { Subscription } from 'rxjs';
interface Assessment {
  id: string;
  lessonId: string;
  clo: any;
  attendance: boolean;
  assignment: boolean;
  quiz: boolean;
  project: boolean;
  lab: boolean;
  exam: boolean;
}

interface AssessFooter {
  id?: string;
  lessonId: string;
  name: string;
  attendanceValue: number;
  assignmentValue: number;
  quizValue: number;
  projectValue: number;
  labValue: number;
  examValue: number;
}

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ToastModule,
    TagModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
  ],
  providers: [MessageService],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss',
})
export class AssessmentComponent {
  @Input() lessonId: string = '';
  assessments: Assessment[] = [];
  assessFooter: AssessFooter[] = [];
  // assessFooter!: any;
  clos: any;

  index!: number;

  types!: SelectItem[];

  isNew = true;
  isNewFooter = true;

  clonedClos: { [s: string]: Assessment } = {};
  editingRowId: number | null = null;
  private refreshSubscription!: Subscription;

  constructor(
    private service: AssessmentService,
    private msgService: MessageService,
    private tabRefreshService: TabRefreshService
  ) { }

  ngOnInit() {
    if (this.lessonId) {
      this.refreshSubscription = this.tabRefreshService.refresh$.subscribe(
        () => {
          this.readData(); // Reload data
        }
      );
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the observable to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  readData() {
    this.service.getAssessment(this.lessonId).subscribe((res) => {
      if (res && res.length) {
        this.isNew = false;
        this.assessments = res.map((item: any) => {
          return {
            id: item._id,
            lessonId: item.lessonId,
            clo: item.clo,
            attendance: item.attendance,
            assignment: item.assignment,
            quiz: item.quiz,
            project: item.project,
            lab: item.lab,
            exam: item.exam,
          };
        });
      } else {
        this.setDefaultValues();
      }
    });

    this.service.getAssessFooter(this.lessonId).subscribe((res) => {
      if (res && res.length) {
        this.isNewFooter = false;
        this.assessFooter = res.map((item: any) => {
          return {
            id: item._id,
            lessonId: item.lessonId,
            name: item.name,
            attendanceValue: item.attendanceValue,
            assignmentValue: item.assignmentValue,
            quizValue: item.quizValue,
            projectValue: item.projectValue,
            labValue: item.labValue,
            examValue: item.examValue,
          };
        });
      } else {
        this.setDefaultFooterValues();
      }
    });
  }

  setDefaultValues() {
    if (this.assessments.length == 0) {
      this.service.getCloList(this.lessonId).subscribe((data: any) => {
        // Map the returned data and create the assessment objects.
        this.assessments = data.map((item: any) => {
          return {
            lessonId: this.lessonId,
            clo: item,
            attendance: 0,
            assignment: 0,
            quiz: 0,
            project: 0,
            lab: 0,
            exam: 0,
          };
        });
        console.log(this.assessments);
      });
    }
  }
  setDefaultFooterValues() {
    this.assessFooter.push(
      {
        lessonId: this.lessonId,
        name: 'Үнэлгээний эзлэх хувь',
        attendanceValue: 0,
        assignmentValue: 0,
        quizValue: 0,
        projectValue: 0,
        labValue: 0,
        examValue: 0,
      },
      {
        lessonId: this.lessonId,
        name: 'Үнэлгээний хийх давтамж',
        attendanceValue: 0,
        assignmentValue: 0,
        quizValue: 0,
        projectValue: 0,
        labValue: 0,
        examValue: 0,
      }
    );
  }

  save() {
    const data = this.assessments.map((item) => ({
      ...item,
      clo: item.clo.id,
    }));

    const footerData = this.assessFooter.map((footer) => ({
      ...footer,
    }));

    const sumField = this.assessFooter[0];
    const sum =
      sumField.attendanceValue +
      sumField.assignmentValue +
      sumField.quizValue +
      sumField.projectValue +
      sumField.labValue +
      sumField.examValue;

    console.log(sum);

    if (sum !== 100) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail:
          'Үнэлгээний эзлэх хувь нийлбэр 100 байх ёстой! \n Одогийн нийлбэр: ' +
          sum,
      });
      return; // Датаг илгээхгүй
    }

    if (this.isNew) {
      this.service.createAssessment(data).subscribe(
        (res: any) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Үнэлгээ амжилттай хадгалагдлаа',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Үнэлгээг хадгалахад алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service.updateAssessment(this.lessonId, data).subscribe(
        (res) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Үнэлгээ амжилттай шинэчлэгдлээ!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Үнэлгээг шинэчлэхэд алдаа гарлаа: ' + err.message,
          });
        }
      );
    }

    if (this.isNewFooter) {
      this.service.createAssessFooter(footerData).subscribe(
        (res: any) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Үнэлгээний мэдээлэл амжилттай хадгалагдлаа',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail:
              'Үнэлгээний мэдээлэл хадгалахад алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service.updateAssessFooter(this.lessonId, footerData).subscribe(
        (res) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Үнэлгээний мэдээлэл амжилттай шинэчлэгдлээ!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail:
              'Үнэлгээний мэдээлэл шинэчлэхэд алдаа гарлаа: ' + err.message,
          });
        }
      );
    }
  }

  getGroupHeaderLabel(cloType: string): string {
    switch (cloType) {
      case 'LEC_SEM':
        return 'Лекц, семинарын хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'LAB':
        return 'Лабораторийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      default:
        return cloType;
    }
  }
}
