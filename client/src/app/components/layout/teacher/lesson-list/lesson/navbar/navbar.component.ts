import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ToastModule,
    SidebarModule,
    RouterModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() lessonId: string = '';
  sidebarVisible: boolean = false;

  items: MenuItem[] | undefined;

  constructor(private route: ActivatedRoute) {}
  // Menu items
  // items = [
  //   {
  //     label: 'Хичээлийн хөтөлбөр',
  //     icon: 'pi pi-plus',
  //     routerLink: ['/main/teacher/curriculum', this.lessonId]
  //   },
  //   {
  //     label: 'Хөтөлбөр',
  //     icon: 'pi pi-plus',
  //     routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-plan']
  //   },
  //   {
  //     label: 'Оюутан',
  //     icon: 'pi pi-plus',
  //     url: '/main/teacher/lesson/student'
  //   },
  //   {
  //     label: 'Ирц',
  //     icon: 'pi pi-plus',
  //     url: '/main/teacher/lesson/student'
  //   },
  //   {
  //     label: 'ХИЧЭЭЛИЙН АГУУЛГА, ЦАГИЙН ХУВААРИЛТ',
  //     icon: 'pi pi-plus',
  //     url: '/main/teacher/lesson/syllabus/schedule'
  //   }
  // ];

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.items = [
      {
        label: 'Ерөнхий тохиргоо',
        icon: 'pi pi-check',
        routerLink: ['/main/admin/config'],
      },
      {
        label: 'PLO тохиргоо',
        icon: 'pi pi-check',
        routerLink: ['/main/admin/plo'],
      },
      {
        label: 'Үйл үгний тохиргоо',
        icon: 'pi pi-check',
        routerLink: ['/main/admin/verb'],
      },
      {
        label: 'Сурагч бүртгэлийн тохиргоо',
        icon: 'pi pi-check',
        routerLink: ['/main/admin/student-import'],
      },
      {
        label: 'Хичээлийн хөтөлбөр',
        icon: 'pi pi-book',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'curriculum'],
      },
      {
        label: 'Дүнгийн ерөнхий төлөвлөлт',
        icon: 'pi pi-check',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-point'],
      },
      {
        label: 'Дүнгийн төлөвлөлт',
        icon: 'pi pi-check',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-plan'],
      },
      {
        label: 'Дүнгийн оноо төлөвлөлт',
        icon: 'pi pi-check',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-point-plan'],
      },
      {
        label: 'Дүнгийн төлөвлөлт3',
        icon: 'pi pi-check',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-tree'],
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
        label: 'Шалгалт оруулах',
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

  // Function to open sidebar
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
