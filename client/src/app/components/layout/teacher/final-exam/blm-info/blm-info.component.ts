import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { Select } from 'primeng/select';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { MatDialog } from '@angular/material/dialog';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';

interface finalExamModel {
  finalExamName: string;
  lessonId: string;
  examType: string;
  examTakeStudentCount: any;
  finalExamQuestion: any;
}

interface finalExamQuestionModel {
  _id: any;
  orderId: number;
  verb: any;
  verbName: string;
  version: string;
  blmLvl: number;
  cloCode: any;
  cloName: string;
  examType: string;
}

interface verbs {
  verbCode: string;
  verbName: string;
}

@Component({
  selector: 'app-blm-info',
  standalone: true,
  imports: [
    PanelModule,
    ButtonModule,
    MenuModule],
  providers: [MessageService],
  templateUrl: './blm-info.component.html',
  styleUrl: './blm-info.component.scss'
})
export class BlmInfoComponent implements OnInit {

  clonedFinalExam: { [s: string]: finalExamQuestionModel } = {};

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }
  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Search',
        icon: 'pi pi-search'
      },
      {
        separator: true
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      }
    ];
  }
}
