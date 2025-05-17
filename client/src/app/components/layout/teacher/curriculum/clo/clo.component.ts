import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormsModule, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CLOService } from '../../../../../services/cloService';
import { SharedDictService } from '../../shared';
import { TabRefreshService } from '../tabRefreshService';
import { InfoComponent } from './info/info.component';

interface Clo {
  id: string;
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
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clo.component.html',
  styleUrls: ['./clo.component.scss'],
})
export class CloComponent {
  @Input() lessonId: string = '';
  clos: Clo[] = [];
  index!: number;
  types!: SelectItem[];
  clonedClos: { [s: string]: Clo } = {};
  editingRowId: string | null = null;

  bloomVerbsMn = [
    'бүтээх',
    'зохион бүтээх',
    'загварчлах',
    'шинэчлэх',
    'боловсруулах',
    'шинэчлэн бичих',
    'шүүн хэлэлцэх',
    'дахин загварчлах',
    'шүүн тунгаах',
    'зэрэглэл тогтоох',
    'ялгах',
    'холбох',
    'хамаарлыг тогтоох',
    'дүрслэх',
    'дүгнэх',
    'ангилах',
    'шийдэх',
    'загварчлах',
    'даалгаврыг хэрэгжүүлэх',
    'загвар гаргах',
    'заах',
    'олж илрүүлэх',
    'дүгнэх',
    'ангилах',
    'харьцуулах',
    'орлуулах',
    'хамаарлыг тодорхойлох',
    'тодорхойлох',
    'тайлбарлах',
    'дүрслэх',
    'таних',
    'мэдэх',
    'ойлгох',
    'хэрэглэх',
    'задлан шинжлэх',
    'үнэлэх',
    'бүтээх',
    'шийдвэрлэх',
  ];

  constructor(
    private service: CLOService,
    private msgService: MessageService,
    private shared: SharedDictService,
    private tabRefreshService: TabRefreshService,
    private confirmationService: ConfirmationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.shared.getDictionary(this.lessonId, false).subscribe((res) => {
      this.types = res;
      if (this.lessonId) {
        this.readData();
      }
    });
  }

  readData() {
    this.service.getCloList(this.lessonId).subscribe((data: any) => {
      this.clos = data.map((item: any) => {
        return {
          id: item.id,
          type: item.type, // <== value-г хадгалж үлдээх нь чухал!
          cloName: item.cloName,
          knowledge: item.knowledge || false,
          skill: item.skill || false,
          attitude: item.attitude || false,
        };
      });
    });
  }

  getCloTypeLabel(value: string): string {
    return this.types?.find((t) => t.value === value)?.label || value;
  }

  getGroupHeaderLabel(cloType: string): string {
    switch (cloType) {
      case 'ALEC':
        return 'Лекцийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'BSEM':
        return 'Семинарын хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'CLAB':
        return 'Лабораторийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      default:
        return cloType;
    }
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
    if (!clo.cloName || !this.bloomVerbMnValidator(clo.cloName)) {
      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: 'Суралцахуйн үр дүн баганад блумын үйл үг орсон байх ёстой.',
      });
      return;
    }
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
            detail: 'Амжилттай шинэчлэгдлээ!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Шинэчлэхэд алдаа гарлаа: ' + err.message,
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

  deleteClo(cloToDelete: Clo) {
    this.confirmationService.confirm({
      message: 'Та энэ CLO-г устгахдаа итгэлтэй байна уу?',
      header: 'Баталгаажуулалт',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Тийм',
      rejectLabel: 'Үгүй',
      accept: () => {
        this.service.deleteClo(cloToDelete.id).subscribe(
          () => {
            this.clos = this.clos.filter((clo) => clo.id !== cloToDelete.id);
            this.tabRefreshService.triggerRefresh();
            this.msgService.add({
              severity: 'success',
              summary: 'Устгалаа',
              detail: 'CLO амжилттай устлаа',
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

  infoTo() {
    this.dialog.open(InfoComponent, {
      width: '60vw',
      height: '90vh',
      maxWidth: 'none',
    });
  }

  bloomVerbMnValidator(value: string): boolean {
    const val = value?.toLowerCase() || '';
    return this.bloomVerbsMn.some((verb) => val.includes(verb));
  }
}
