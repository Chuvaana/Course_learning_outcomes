import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';

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

  constructor() { }
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
