import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ExamService } from '../../../../services/examService';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-question-type-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    TableModule,
    Menu,
  ],
  templateUrl: './question-type-list.component.html',
  styleUrls: ['./question-type-list.component.scss']
})
export class QuestionTypeListComponent {  // Fixed the typo here
  studentForm: FormGroup;
  products: any[] = [];
  active = true;
  valueTitle : any;

  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      id: ['', Validators.required],
      questionType: ['', Validators.required],
      question: ['', Validators.required],
      questionPoint: ['', Validators.required],
      blumLvl: ['', Validators.required],
      cloLvl: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required],
      answer4: ['', Validators.required],
      answer5: ['', Validators.required],
      answer6: ['', Validators.required],
      answer7: ['', Validators.required],
      answer8: ['', Validators.required],
      createdBy: ['', Validators.required]
    });
  }

  items: MenuItem[] | undefined;
  ngOnInit() {
    this.active = true;
    this.items = [
      {
        label: 'Асуултууд',
        items: [
          {
            label: 'Олон сонголттой асуулт',
            icon: 'pi pi-palette',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Ганц сонголттой асуулт',
            icon: 'pi pi-link',
            title: 'Easdsssssssssssssssssne hu asuult ni .....'
          },
          {
            label: 'Холбох асуулт',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Богино хариулттай',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Зөвхөн тоо оруулах',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Эссэй',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Зайнд бөглөх',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Шигтгэсэн хариултууд',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Тоо бодох',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Тоо бодох олон сонготтой',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Зөөж зөв газар байрлуулах',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Зурган дээр зөв газар байрлуулах',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          },
          {
            label: 'Дараалал тодрох зөв үгийг гүйцээж оруулах',
            icon: 'pi pi-home',
            title: 'Ene hu asuult ni .....'
          }
        ]
      }
    ];
  }
  value(e : any){
    this.valueTitle = e;
    this.active = false;
    console.log('asdfasdf');
  }
}
