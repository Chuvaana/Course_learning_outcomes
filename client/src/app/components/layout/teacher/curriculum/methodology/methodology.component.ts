import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MethodService } from '../../../../../services/methodService';
import { MultiSelectModule } from 'primeng/multiselect';

interface Method {
  id: number;
  lessonId: string,
  pedagogy: string;
  deliveryMode: string;
  cloRelevance: string[]
}

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ToastModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    MultiSelectModule
  ],
  providers: [MessageService],
  templateUrl: './methodology.component.html',
  styleUrl: './methodology.component.scss'
})
export class MethodologyComponent {
  @Input() lessonId: string = '';
  methodologys: Method[] = [];
  clonedMethods: { [s: string]: Method } = {};
  clos: any;

  isNew = true;

  deliveryModes = [
    { label: 'Лекц', value: 'lec' },
    { label: 'Лаборатори', value: 'lab' },
    { label: 'Семинар', value: 'sem' }
  ];

  pedagogyOptions = [
    { label: 'Асуудалд суурилсан сургалт', value: 'Lecture' },
    { label: 'Туршилтад суурилсан сургалт ', value: 'Discussion' }
  ];

  constructor(private msgService: MessageService, private service: MethodService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getCloList(this.lessonId).subscribe(res => {
      this.clos = res;
    });
    this.service.getMethod(this.lessonId).subscribe((data: any) => {
      if (data != null && data.length != 0) {
        this.isNew = false;
        this.methodologys = data.map((item: any) => ({
          id: item.id,
          pedagogy: item.pedagogy,
          deliveryMode: item.deliveryMode,
          cloRelevance: item.cloRelevance
        }));
      }
    });
  }

  onRowEditInit(method: Method, index: number) {
    this.clonedMethods[method.id] = { ...method };
  }

  onRowEditSave(method: Method) {
    method.cloRelevance = method.cloRelevance.map(id => {
      const clo = this.clos.find((c: { id: string; }) => c.id === id);
      return clo ? clo.cloName : id;
    });

    if (this.isNew) {
      this.service.createMethod(method).subscribe((res: any) => {
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
        })
    } else {
      this.service.updateMethod(method).subscribe((res: any) => { })

    }

  }


  onRowEditCancel(method: Method, index: number) {
    this.methodologys[index] = { ...this.clonedMethods[method.id] };
    delete this.clonedMethods[method.id];
  }

  addMethod() {
    const newMethod: Method = {
      id: this.methodologys.length + 1,
      lessonId: this.lessonId,
      pedagogy: '',
      deliveryMode: '',
      cloRelevance: []
    };

    this.methodologys = [...this.methodologys, newMethod];

    setTimeout(() => {
      this.onRowEditInit(newMethod, this.methodologys.length - 1);
    });
  }
}
