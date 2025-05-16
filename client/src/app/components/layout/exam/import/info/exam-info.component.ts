import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Image } from 'primeng/image';

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
  selector: 'app-exam-info',
  standalone: true,
  imports: [Image],
  providers: [MessageService],
  templateUrl: './exam-info.component.html',
  styleUrl: './exam-info.component.scss'
})
export class ExamInfoComponent implements OnInit {

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
