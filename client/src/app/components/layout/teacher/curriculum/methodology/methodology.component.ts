import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { TabRefreshService } from '../tabRefreshService';
import { CLOService } from '../../../../../services/cloService';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatDialog } from '@angular/material/dialog';
import { MethodInfoComponent } from './method-info/method-info.component';

interface Method {
  id: string;
  lessonId: string;
  pedagogy: string;
  deliveryMode: string;
  cloRelevance: string[];
  classroom: boolean;
  electronic: boolean;
  combined: boolean;
}
interface Method1 {
  lessonId: string;
  pedagogy: string;
  deliveryMode: string;
  cloRelevance: string[];
  classroom: boolean;
  electronic: boolean;
  combined: boolean;
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
    CheckboxModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './methodology.component.html',
  styleUrl: './methodology.component.scss',
})
export class MethodologyComponent {
  @Input() lessonId: string = '';
  methodologys: Method[] = [];
  clonedMethods: { [s: string]: Method } = {};
  clos: any;
  editingRowId: string | null = null;
  index!: number;
  isNew = true;

  deliveryModes = [
    // { label: 'Тонгоруу анги', value: 'CLASS' },
    { label: 'Кейсд суурилсан сургалт', value: 'CASE' },
    { label: 'Сорилтонд суурилсан сургалт', value: 'QUIZ' },
    { label: 'Асуудалд суурилсан сургалт', value: 'PROBLEM' },
    { label: 'Төсөлд суурилсан сургалт', value: 'PROJECT' },
    // { label: 'Туршилтад суурилсан сургалт', value: 'EXPERIMENT' },
  ];

  pedagogyOptions = [
    { label: 'Лекц', value: 'Lecture' },
    { label: 'Хэлэлцүүлэг, семинар', value: 'Discussion' },
    { label: 'Лаборатори, туршилт', value: 'Laboratory' },
    { label: 'Практик', value: 'Practice' },
  ];

  constructor(
    private msgService: MessageService,
    private service: MethodService,
    private tabRefreshService: TabRefreshService,
    private cloService: CLOService,
    private confirmationService: ConfirmationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.lessonId) {
      this.loadData();
      this.tabRefreshService.refresh$.subscribe(() => {
        this.loadData();
      });
    }
  }

  loadData() {
    this.cloService.getCloList(this.lessonId).subscribe((res) => {
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
          cloRelevance: item.cloRelevance.map((clo: any) => clo.id), // Extract only CLO IDs
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
      combined: false,
    };
  }

  onRowEditSave(method: Method) {
    if (method.id === null || method.id === undefined) {
      this.service.createMethod(method).subscribe(
        (res: any) => {
          this.loadData();
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
      this.service.updateMethod(method).subscribe((res: any) => {});
    }
    this.editingRowId = null;
  }

  onRowEditCancel(method: Method, index: number) {
    this.methodologys[index] = { ...this.clonedMethods[method.id] };
    delete this.clonedMethods[method.id];
    this.editingRowId = null;
  }

  deleteMethod(method: Method) {
    this.confirmationService.confirm({
      message: 'Та энэ аргыг устгахдаа итгэлтэй байна уу?',
      header: 'Баталгаажуулалт',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Тийм',
      rejectLabel: 'Үгүй',
      accept: () => {
        this.service.deleteMethod(method.id).subscribe(
          () => {
            this.methodologys = this.methodologys.filter(
              (method: { id: any }) => method.id !== method.id
            );
            this.tabRefreshService.triggerRefresh();
            this.msgService.add({
              severity: 'success',
              summary: 'Устгалаа',
              detail: 'Амжилттай устлаа',
            });
          },
          (error) => {
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Устгах үед алдаа гарлаа: ' + error.error.message,
            });
          }
        );
      },
    });
  }

  getCloName(cloId: string): string {
    const clo = this.clos.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getPedagogyName(pedagogyId: string): string {
    const pedagogy = this.pedagogyOptions.find((p) => p.value === pedagogyId);
    return pedagogy ? pedagogy.label : 'Unknown';
  }

  getDeliveryModeName(deliveryModeId: string): string {
    const mode = this.deliveryModes.find(
      (m: { value: string }) => m.value === deliveryModeId
    );
    return mode ? mode.label : 'Unknown';
  }

  addMethod() {
    const newMethod: Method1 = {
      lessonId: this.lessonId,
      pedagogy: 'CLASS',
      deliveryMode: 'Lecture',
      cloRelevance: [],
      classroom: false,
      electronic: false,
      combined: false,
    };

    this.methodologys = [...this.methodologys, newMethod as Method];

    setTimeout(() => {
      this.onRowEditInit(newMethod as Method, this.methodologys.length - 1);
    });
  }

  infoTo() {
    this.dialog.open(MethodInfoComponent, {
      width: '60vw',
      height: '90vh',
      maxWidth: 'none',
    });
  }
}
