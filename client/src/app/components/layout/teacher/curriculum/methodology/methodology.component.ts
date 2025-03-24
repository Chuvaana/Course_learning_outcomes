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
import { CheckboxModule } from 'primeng/checkbox';

interface Method {
  id: number;
  lessonId: string,
  pedagogy: string;
  deliveryMode: string;
  cloRelevance: string[],
  classroom: boolean,
  electronic: boolean,
  combined: boolean
}
interface Method1 {
  lessonId: string,
  pedagogy: string;
  deliveryMode: string;
  cloRelevance: string[],
  classroom: boolean,
  electronic: boolean,
  combined: boolean
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
    MultiSelectModule,
    CheckboxModule
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
  editingRowId: number | null = null;
  newRowData: any;
  index!: number;
  isNew = true;

  deliveryModes =
    [
      { label: 'Тонгоруу анги', value: 'CLASS' },
      { label: 'Төсөлд суурилсан сургалт', value: 'PROJECT' },
      { label: 'Туршилтад суурилсан сургалт', value: 'EXPERIMENT' },
      { label: 'Асуудалд суурилсан сургалт', value: 'PROBLEM' }
    ];

  pedagogyOptions = [
    { label: 'Лекц', value: 'Lecture' },
    { label: 'Хэлэлцүүлэг, семинар', value: 'Discussion' },
    { label: 'Лаборатори, туршилт', value: 'Laboratory' },
    { label: 'Практик', value: 'Practice' }
  ];

  constructor(private msgService: MessageService, private service: MethodService) { }

  ngOnInit() {
    this.loadData();
    this.newRowData = {
      lessonId: this.lessonId,
      pedagogy: '',
      deliveryMode: '',
      cloRelevance: [],
      classroom: false,
      electronic: false,
      combined: false
    };

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
          classroom: item.classroom,
          electronic: item.electronic,
          combined: item.combined,
          cloRelevance: item.cloRelevance.map((clo: any) => clo.id) // Extract only CLO IDs
        }));
      }
    });
  }

  onRowEditInit(method: Method, index: number) {
    this.index = index + 1;
    this.clonedMethods[method.id] = { ...method };
    this.editingRowId = method.id;
  }

  newRow() {
    return {
      lessonId: this.lessonId,
      pedagogy: '',
      deliveryMode: '',
      cloRelevance: [],
      classroom: false,
      electronic: false,
      combined: false
    };
  }

  onRowEditSave(method: Method) {
    // const methodData = { ...method, lessonId: this.lessonId };

    if (method.id === null || method.id === undefined) {
      this.service.createMethod(method).subscribe((res: any) => {
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
        })
    } else {
      this.service.updateMethod(method).subscribe((res: any) => { })

    }
    this.editingRowId = null;
  }


  onRowEditCancel(method: Method, index: number) {
    this.methodologys[index] = { ...this.clonedMethods[method.id] };
    delete this.clonedMethods[method.id];
    this.editingRowId = null;
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

    const newMethod: Method1 = {
      lessonId: this.lessonId,
      pedagogy: '',
      deliveryMode: '',
      cloRelevance: [],
      classroom: false,
      electronic: false,
      combined: false
    };

    this.methodologys = [...this.methodologys, newMethod as Method];

    setTimeout(() => {
      this.onRowEditInit(newMethod as Method, this.methodologys.length - 1);
    });
  }
}
