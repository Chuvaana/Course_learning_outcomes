import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CLOService } from '../../../../../services/cloService';
import { CheckboxModule } from 'primeng/checkbox';
import { AssessmentService } from '../../../../../services/assessmentService';
import { MethodService } from '../../../../../services/methodService';
import { ScheduleService } from '../../../../../services/schedule.service';
import { TabRefreshService } from '../tabRefreshService';

interface Clo {
  id: number;
  type: string;
  cloName: string;
  knowledge: boolean;
  skill: boolean;
  attitude: boolean;
}
interface Clo1 {
  type: string;
  cloName: string;
  knowledge: boolean;
  skill: boolean;
  attitude: boolean;
}

@Component({
  selector: 'app-clo',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
  ],
  providers: [MessageService],
  templateUrl: './clo.component.html',
  styleUrls: ['./clo.component.scss'],
})
export class CloComponent {
  @Input() lessonId: string = '';
  clos: Clo[] = [];
  index!: number;
  types!: SelectItem[];
  clonedClos: { [s: string]: Clo } = {};
  editingRowId: number | null = null;

  constructor(
    private service: CLOService,
    private msgService: MessageService,
    private assessmentService: AssessmentService,
    private methodService: MethodService,
    private scheduleService: ScheduleService,
    private tabRefreshService: TabRefreshService
  ) {}

  ngOnInit() {
    if (this.lessonId) {
      this.readData();
    }

    this.types = [
      { label: 'Лекц', value: 'LEC' },
      { label: 'Семинар', value: 'SEM' },
      { label: 'Лаборатори', value: 'LAB' },
    ];
  }

  readData() {
    this.service.getCloList(this.lessonId).subscribe((data: any) => {
      this.clos = data.map((item: any) => {
        // Find the label corresponding to item.type
        const typeLabel = this.types.find(
          (type) => type.value === item.type
        )?.label;

        return {
          id: item.id,
          type: typeLabel, // keep the value as it is
          cloName: item.cloName,
          knowledge: item.knowledge || false,
          skill: item.skill || false,
          attitude: item.attitude || false,
        };
      });
    });
  }

  onRowEditInit(clo: Clo, index: number) {
    this.index = index + 1;
    this.clonedClos[clo.id] = { ...clo };
    this.editingRowId = clo.id;
  }

  newRow() {
    return {
      lessonId: this.lessonId,
      type: '',
      cloName: '',
      knowledge: false,
      skill: false,
      attitude: false,
    };
  }

  onRowEditSave(clo: Clo) {
    const cloData = { ...clo, lessonId: this.lessonId };

    if (clo.id === null || clo.id === undefined) {
      this.service.registerClo(cloData).subscribe(
        (res: Clo) => {
          clo.id = res.id;
          this.saveAssess(res.id);
          this.saveCloPlan(res);
          this.readData();
          this.tabRefreshService.triggerRefresh();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
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
      this.service.updateClo(clo).subscribe(
        (res) => {
          this.readData();
          this.tabRefreshService.triggerRefresh();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'CLO updated successfully!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Failed to update CLO: ' + err.message,
          });
        }
      );
    }
    this.editingRowId = null;
  }

  onRowEditCancel(clo: Clo, index: number) {
    this.clos[index] = { ...this.clonedClos[clo.id] };
    delete this.clonedClos[clo.id];
    this.editingRowId = null;
  }

  getGroupHeaderLabel(cloType: string): string {
    switch (cloType) {
      case 'Лекц':
        return 'Лекцийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'Семинар':
        return 'Семинарын хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'Лаборатори':
        return 'Лабораторийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      default:
        return cloType;
    }
  }

  addClo() {
    const newClo: Clo1 = {
      type: '',
      cloName: '',
      knowledge: false,
      skill: false,
      attitude: false,
    };

    this.clos = [...this.clos, newClo as Clo];

    setTimeout(() => {
      this.onRowEditInit(newClo as Clo, this.clos.length - 1);
    });
  }

  saveAssess(data: any) {
    const assessments = [
      {
        lessonId: this.lessonId,
        clo: data,
        attendance: false,
        assignment: false,
        quiz: false,
        project: false,
        lab: false,
        exam: false,
      },
    ];
    this.assessmentService.createAssessment(assessments).subscribe((res) => {
      console.log(res);
    });
  }

  saveCloPlan(clo: any) {
    const plan = [
      {
        id: '',
        cloId: clo.id,
        cloName: clo.cloName,
        cloType: clo.type,
        lessonId: this.lessonId,
        timeManagement: 0,
        engagement: 0,
        recall: 0,
        problemSolving: 0,
        recall2: 0,
        problemSolving2: 0,
        toExp: 0,
        processing: 0,
        decisionMaking: 0,
        formulation: 0,
        analysis: 0,
        implementation: 0,
        understandingLevel: 0,
        analysisLevel: 0,
        creationLevel: 0,
      },
    ];
    this.service.saveCloPlan(plan).subscribe((res) => {
      console.log(res);
    });
  }
}
