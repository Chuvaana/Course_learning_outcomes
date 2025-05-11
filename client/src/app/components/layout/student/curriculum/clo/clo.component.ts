import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CLOService } from '../../../../../services/cloService';
import { SharedDictService } from '../../../teacher/shared';
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
    private tabRefreshService: TabRefreshService,
    private shared: SharedDictService
  ) {}

  ngOnInit() {
    if (this.lessonId) {
      this.readData();
    }

    this.shared.getDictionary(this.lessonId, false).subscribe((res) => {
      this.types = res;
    });
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
}
