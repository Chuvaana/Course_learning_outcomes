import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CLOService } from '../../../../../services/cloService';
import { MethodService } from '../../../../../services/methodService';
import { TabRefreshService } from '../tabRefreshService';

interface Method {
  id: number;
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
  ],
  providers: [MessageService],
  templateUrl: './methodology.component.html',
  styleUrl: './methodology.component.scss',
})
export class MethodologyComponent {
  @Input() lessonId: string = '';
  methodologys: Method[] = [];
  clonedMethods: { [s: string]: Method } = {};
  clos: any;
  editingRowId: number | null = null;
  index!: number;
  isNew = true;

  deliveryModes = [
    { label: 'Тонгоруу анги', value: 'CLASS' },
    { label: 'Төсөлд суурилсан сургалт', value: 'PROJECT' },
    { label: 'Туршилтад суурилсан сургалт', value: 'EXPERIMENT' },
    { label: 'Асуудалд суурилсан сургалт', value: 'PROBLEM' },
  ];

  pedagogyOptions = [
    { label: 'Лекц', value: 'Lecture' },
    { label: 'Хэлэлцүүлэг, семинар', value: 'Discussion' },
    { label: 'Лаборатори, туршилт', value: 'Laboratory' },
    { label: 'Практик', value: 'Practice' },
  ];

  constructor(
    private service: MethodService,
    private tabRefreshService: TabRefreshService,
    private cloService: CLOService
  ) {}

  ngOnInit() {
    if (this.lessonId) {
      this.loadData();
      this.tabRefreshService.refresh$.subscribe(() => {
        this.loadData(); // Датаг дахин ачаалах функц
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
}
