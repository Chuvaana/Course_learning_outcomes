import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MethodService } from '../../../../../services/methodService';

interface Method {
  id: number;
  lessonId: string,
  pedagogy: string;
  deliveryMode: string;
  cloRelevance: string[]
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
    DropdownModule,
    ButtonModule,
    MultiSelectModule],
  providers: [MessageService],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class AssessmentComponent {
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

  asMethod = [
    { label: 'Хичээлийн ирц', value: 'irst' },
    { label: 'Идэвх оролцоо', value: 'oroltsoo' },
    { label: 'Гэрийн даалгавар', value: 'daalgavar' },
    { label: 'Явцын сорил', value: 'soril' },
    { label: 'Лабораторын тайлан', value: 'lab' },
    { label: 'Бие даалтын ажил', value: 'bd' },
    { label: 'Улирлын шалгалт', value: 'shalgalt' },
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
      if (data && data.length) {
        this.isNew = false;
        this.methodologys = data.map((item: any) => ({
          id: item._id,
          pedagogy: item.pedagogy,
          deliveryMode: item.deliveryMode,
          cloRelevance: item.cloRelevance.map((clo: any) => clo.id) // Extract only CLO IDs
        }));
      }
    });
  }

  onRowEditInit(method: Method, index: number) {
    this.clonedMethods[method.id] = { ...method };
  }

  onRowEditSave(method: Method) {
    method.cloRelevance = method.cloRelevance.map(id => {
      return this.clos.find((c: { id: string }) => c.id === id)?.id || id;
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

  getCloName(cloId: string): string {
    const clo = this.clos.find((c: { id: string; }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getPedagogyName(pedagogyId: string): string {
    const pedagogy = this.pedagogyOptions.find(p => p.value === pedagogyId);
    return pedagogy ? pedagogy.label : "Unknown";
  }

  getDeliveryModeName(deliveryModeId: string): string {
    const mode = this.deliveryModes.find((m: { value: string; }) => m.value === deliveryModeId);
    return mode ? mode.label : "Unknown";
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
