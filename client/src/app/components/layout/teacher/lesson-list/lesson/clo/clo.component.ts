import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TeacherService } from '../../../../../../services/teacherService';
import { MessageService, SelectItem } from 'primeng/api';

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
  clos: Clo[] = [];

  index!: number;

  types!: SelectItem[];

  newRowData: any;

  clonedClos: { [s: string]: Clo } = {};
  editingRowId: number | null = null; // 

  constructor(private service: TeacherService, private msgService: MessageService) { }

  ngOnInit() {
    this.service.getCloList().subscribe((data: any) => {
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

    this.newRowData = { type: '', cloName: ''};
  }

  onRowEditInit(clo: Clo, index: number) {
    this.index = index + 1;
    this.clonedClos[clo.id] = { ...clo };
    this.editingRowId = clo.id; // Set the current editing row
  }

  newRow() {
    return { type: '', cloName: ''};
  }

  onRowEditSave(clo: Clo) {
    const { id, ...cloData } = clo; // Deconstruct to remove `id` when sending to service
    if (clo.id === null || clo.id === undefined) {
      // If ID is 0, create a new CLO (don't send `id`)
      this.service.registerClo(cloData).subscribe(
        (res: Clo) => {
          clo.id = res.id; // Assign the actual ID from backend
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
      // If CLO already exists, update it
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
    this.editingRowId = null; // Clear editing state
  }

  onRowEditCancel(clo: Clo, index: number) {
    this.clos[index] = { ...this.clonedClos[clo.id] };
    delete this.clonedClos[clo.id];
    this.editingRowId = null; // Clear editing state
  }

  addClo() {
    // Create a new CLO without `id`
    const newClo: Clo1 = {
      type: '',
      cloName: ''
    };

    // Add the new CLO and trigger change detection
    this.clos = [...this.clos, newClo as Clo]; // Casting to `Clo` to match the interface

    setTimeout(() => {
      this.onRowEditInit(newClo as Clo, this.clos.length - 1 ); // Automatically start editing mode
    });
  }
}
