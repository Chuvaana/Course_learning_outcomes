import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AssessmentService } from '../../../../../services/assessmentService';
interface Clo {
  id: number;
  lessonId: string,
  clo: any;
  attendance: string;
  assignment: boolean;
  quiz: boolean;
  project: boolean;
  lab: boolean;
  exam: boolean;
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
    InputTextModule],
  providers: [MessageService],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class AssessmentComponent {
  @Input() lessonId: string = '';
  assessments: Clo[] = [];
  clos: any;

  index!: number;

  types!: SelectItem[];

  isNew = true;

  clonedClos: { [s: string]: Clo } = {};
  editingRowId: number | null = null;

  constructor(private service: AssessmentService, private msgService: MessageService) { }

  ngOnInit() {
    this.readData();
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
            exam: item.exam
          };
        });
      } else {
        this.setDefaultValues();
      }
    })

  }

  setDefaultValues() {
    this.service.getCloList(this.lessonId).subscribe((data: any) => {
      this.assessments = data.map((item: any) => {
        return {
          lessonId: this.lessonId,
          clo: item,
          attendance: false,
          assignment: false,
          quiz: false,
          project: false,
          lab: false,
          exam: false
        };
      });
      console.log(this.assessments);
    });
  }

  save() {
    const data = this.assessments.map((item) => ({
      ...item,
      clo: item.clo.id,
    }));
    if (this.isNew) {
      this.service.createAssessment(data).subscribe(
        (res: any) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
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
            detail: 'Амжилттай шинэчлэгдлээ!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    }
  }

  getGroupHeaderLabel(cloType: string): string {
    switch (cloType) {
      case 'LAB':
        return 'Лекц, семинарын хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'LEC_SEM':
        return 'Лабораторийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      default:
        return cloType;
    }
  }
}
