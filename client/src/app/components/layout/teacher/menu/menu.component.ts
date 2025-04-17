import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  // items: MenuItem[] | undefined;

  // ngOnInit() {
  //   this.items = [
  //     {
  //       label: 'Хичээл',
  //       icon: 'pi pi-book',
  //       url: '/main/teacher/lessonList',
  //     },
  //     {
  //       label: 'Тайлан',
  //       icon: 'pi pi-home',
  //       url: '/main/teacher/report-lesson-list',
  //     },
  //     {
  //       label: 'Шалгалт',
  //       icon: 'pi pi-star',
  //       url: '/main/teacher/question-create',
  //     },
  //     {
  //       label: 'Санал асуулга',
  //       icon: 'pi pi-star',
  //       url: '/',
  //     },
  //     {
  //       label: 'Асуултын жагсаалт',
  //       icon: 'pi pi-star',
  //       url: '/main/teacher/questionlist',
  //     },
  //     // {
  //     //   label: 'Шалгалт',
  //     //   icon: 'pi pi-search',
  //     //   items: [
  //     //     {
  //     //       label: 'Core',
  //     //       icon: 'pi pi-bolt',
  //     //       shortcut: '⌘+S'
  //     //     },
  //     //     {
  //     //       label: 'Blocks',
  //     //       icon: 'pi pi-server',
  //     //       shortcut: '⌘+B'
  //     //     },
  //     //     {
  //     //       label: 'UI Kit',
  //     //       icon: 'pi pi-pencil',
  //     //       shortcut: '⌘+U'
  //     //     },
  //     //     {
  //     //       separator: true
  //     //     },
  //     //     {
  //     //       label: 'Templates',
  //     //       icon: 'pi pi-palette',
  //     //       items: [
  //     //         {
  //     //           label: 'Apollo',
  //     //           icon: 'pi pi-palette',
  //     //           badge: '2'
  //     //         },
  //     //         {
  //     //           label: 'Ultima',
  //     //           icon: 'pi pi-palette',
  //     //           badge: '3'
  //     //         }
  //     //       ]
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   label: 'Contact',
  //     //   icon: 'pi pi-envelope',
  //     //   badge: '3'
  //     // }
  //   ];
  // }

  lessonId: string = '';
  items: MenuItem[] | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.items = [
      {
        label: 'Хичээлийн хөтөлбөр',
        icon: 'pi pi-book',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'curriculum'],
      },
      {
        label: 'Төлөвлөгөө',
        icon: 'pi pi-book',
        items: [
          // {
          //   label: 'Дүнгийн ерөнхий төлөвлөлт',
          //   icon: 'pi pi-check',
          //   routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-point'],
          // },
          // {
          //   label: 'Дүнгийн төлөвлөлт',
          //   icon: 'pi pi-check',
          //   routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-plan'],
          // },
          {
            label: 'Дүнгийн төлөвлөлт3',
            icon: 'pi pi-check',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-tree'],
          },
          {
            label: 'Дүнгийн оноо төлөвлөлт',
            icon: 'pi pi-check',
            routerLink: [
              '/main/teacher/lesson',
              this.lessonId,
              'clo-point-plan',
            ],
          },
        ],
      },
      {
        label: 'Оюутан',
        icon: 'pi pi-graduation-cap',
        items: [
          {
            label: 'Жагсаалт',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'studentList'],
          },
          {
            label: 'Бүртгэх',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'student'],
          },
        ],
      },
      {
        label: 'Ирц',
        icon: 'pi pi-plus',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'attendance'],
      },
      {
        label: 'Шалгалт',
        icon: 'pi pi-plus',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'exam-import'],
      },
      {
        label: 'Дүн',
        icon: 'pi pi-graduation-cap',
        items: [
          {
            label: 'Лабораторийн дүн',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'lab-grade'],
          },
          {
            label: 'Семинарын дүн',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'sem-grade'],
          },
        ],
      },
    ];
  }
}
