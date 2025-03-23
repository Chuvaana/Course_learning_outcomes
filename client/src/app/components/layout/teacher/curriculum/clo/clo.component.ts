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

interface Clo {
  id: number;
  type: string;
  cloName: string;
}
interface Clo1 {
  type: string;
  cloName: string;
}

@Component({
  selector: 'app-clo',
  standalone: true,
  imports: [TableModule, ToastModule, CommonModule, TagModule, SelectModule, ButtonModule, InputTextModule, FormsModule],
  providers: [MessageService],
  templateUrl: './clo.component.html',
  styleUrl: './clo.component.scss'
})
export class CloComponent {
  @Input() lessonId: string = '';
  clos: Clo[] = [];

  index!: number;

  types!: SelectItem[];

  newRowData: any;

  clonedClos: { [s: string]: Clo } = {};
  editingRowId: number | null = null; // 

  constructor(private service: CLOService, private msgService: MessageService) { }

  ngOnInit() {
    this.service.getCloList(this.lessonId).subscribe((data: any) => {
      this.clos = data.map((item: any) => ({
        id: item.id,
        type: item.type,
        cloName: item.cloName
      }));
    });

    this.types = [
      { label: 'Лекц семинар', value: 'LEC_SEM' },
      { label: 'Лаборатори', value: 'LAB' }
    ];

    this.newRowData = { lessonId: this.lessonId, type: '', cloName: '' };
  }

  onRowEditInit(clo: Clo, index: number) {
    this.index = index + 1;
    this.clonedClos[clo.id] = { ...clo };
    this.editingRowId = clo.id;
  }

  newRow() {
    return { lessonId: this.lessonId, type: '', cloName: '' };
  }

  onRowEditSave(clo: Clo) {
    // const { id, ...cloData } = clo;
    const cloData = { ...clo, lessonId: this.lessonId };

    if (clo.id === null || clo.id === undefined) {
      this.service.registerClo(cloData).subscribe(
        (res: Clo) => {
          clo.id = res.id;
          this.msgService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'New CLO created successfully!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create CLO: ' + err.message,
          });
        }
      );
    } else {
      this.service.updateClo(clo).subscribe(
        (res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'CLO updated successfully!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
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

  addClo() {
    const newClo: Clo1 = {
      type: '',
      cloName: ''
    };

    this.clos = [...this.clos, newClo as Clo];

    setTimeout(() => {
      this.onRowEditInit(newClo as Clo, this.clos.length - 1);
    });
  }
}
