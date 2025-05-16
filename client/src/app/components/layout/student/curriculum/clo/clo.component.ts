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

  constructor(private service: CLOService, private shared: SharedDictService) {}

  ngOnInit() {
    if (this.lessonId) {
      this.shared.getDictionary(this.lessonId, false).subscribe((res) => {
        this.types = res;
        this.readData();
      });
    }
  }

  readData() {
    this.service.getCloList(this.lessonId).subscribe((data: any) => {
      this.clos = data.map((item: any) => {
        const typeLabel = this.types.find(
          (type) => type.value === item.type
        )?.label;

        return {
          id: item.id,
          type: typeLabel,
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
}
