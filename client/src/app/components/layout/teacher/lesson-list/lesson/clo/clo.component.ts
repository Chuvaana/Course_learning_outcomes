import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectItem, SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TeacherService } from '../../../../../../services/teacherService';
import { MessageService } from 'primeng/api';

interface Clo {
  id: number;
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
  clos!: Clo[];

  statuses!: SelectItem[];

  clonedClos: { [s: string]: Clo } = {};

  constructor(private service: TeacherService, private msgService: MessageService) {}

  ngOnInit() {
      this.service.getCloList().subscribe((data) => {

      })

      // this.statuses = [
      //     { label: 'In Stock', value: 'INSTOCK' },
      //     { label: 'Low Stock', value: 'LOWSTOCK' },
      //     { label: 'Out of Stock', value: 'OUTOFSTOCK' }
      // ];
  }

  onRowEditInit(clo: Clo) {
      this.clonedClos[clo.id as number] = { ...clo };
  }

  onRowEditSave(clo: Clo) {
  }

  onRowEditCancel(clo: Clo, index: number) {
      // this.clos[index] = this.clonedClos[clo.id as string];
      // delete this.clonedClos[clo.id as string];
  }
}
