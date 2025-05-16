import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  lessonId: string = '';
  items: MenuItem[] | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';
    this.items = this.buildInitialMenu();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/teacher-login']);
  }

  buildInitialMenu() {
    return [
      {
        label: 'Хичээл',
        icon: 'pi pi-home',
        routerLink: ['/main/teacher/lessonList'],
      },
      {
        label: 'Төлөвлөгөө',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Дүнгийн төлөвлөлт',
            icon: 'pi pi-check',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-tree'],
          },
          {
            label: 'Дүнгийн үзлэгийн төлөвлөлт',
            icon: 'pi pi-check',
            routerLink: [
              '/main/teacher/lesson',
              this.lessonId,
              'clo-freq-plan',
            ],
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
        label: 'Хичээлийн хөтөлбөр',
        icon: 'pi pi-book',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'curriculum'],
      },
      {
        label: 'Оюутан',
        icon: 'pi pi-graduation-cap',
        items: [
          {
            label: 'Жагсаалт',
            icon: 'pi pi-list',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'studentList'],
          },
          {
            label: 'Бүртгэх',
            icon: 'pi pi-plus',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'student'],
          },
        ],
      },
      {
        label: 'Ирц, идэвх',
        icon: 'pi pi-user-edit',
        items: [
          {
            label: 'Ирц',
            icon: 'pi pi-calendar',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'attendance'],
          },
          {
            label: 'Идэвх',
            icon: 'pi pi-bolt',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'activity'],
          },
        ],
      },
      {
        label: 'Дүнгийн бүртгэл',
        icon: 'pi pi-book',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'register-grade'],
      },
      {
        label: 'Шалгалт',
        icon: 'pi pi-plus',
        items: [
          {
            label: 'Шалгалтын бүтэц бэлтгэх',
            icon: 'pi pi-plus',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'final-exam'],
          },
          {
            label: 'Шалгалт импорт файл оруулах',
            icon: 'pi pi-file-import',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'exam-import'],
          },
          {
            label: 'Шалгалт дүнгийн жагсаалт',
            icon: 'pi pi-list-check',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'exam-list'],
          },
        ],
      },
      {
        label: 'Дүн',
        icon: 'pi pi-chart-line',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'total-grade'],
      },
      {
        label: 'Санал асуулга',
        icon: 'pi pi-calendar-clock',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'progress-poll'],
      },
      {
        label: 'Тайлан',
        icon: 'pi pi-clipboard',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'report'],
      },
    ];
  }
}
