import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { AssessmentService } from '../../../../services/assessmentService';

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
  lessonId: string = '';
  items: MenuItem[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private service: AssessmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.items = [
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
        label: 'Ирц, идэвх',
        icon: 'pi pi-plus',
        items: [
          {
            label: 'Ирц',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'attendance'],
          },
          {
            label: 'Идэвх',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'activity'],
          },
        ],
      },
      {
        label: 'Шалгалт',
        icon: 'pi pi-plus',
        items: [
          {
            label: 'Шалгалт импорт файл оруулах',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'exam-import'],
          },
          {
            label: 'Шалгалт дүнгийн жагсаалт',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'exam-list'],
          },
        ],
      },
      {
        label: 'Улирлын шалгалт бэлдэх',
        icon: 'pi pi-plus',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'final-exam'],
      },
      {
        label: 'Санал асуулга',
        icon: 'pi pi-plus',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'progress-poll'],
      },
      {
        label: 'Тайлан',
        icon: 'pi pi-home',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'report'],
      },
    ];

    this.service.getAssessmentByLesson(this.lessonId).subscribe((res: any) => {
      const plansArray =
        res?.plans?.filter((item: any) => item.methodType === 'PROC') || [];

      const subMenu: { label: string; icon: string; routerLink: string[] }[] =
        [];
      plansArray.forEach((plan: any) => {
        subMenu.push({
          label: plan.methodName,
          icon: 'pi pi-graduation-cap',
          routerLink: [
            '/main/teacher/lesson',
            this.lessonId,
            'grade',
            plan._id,
          ],
        });
      });
      if (subMenu.length > 0) {
        const newItem = {
          label: 'Явц',
          icon: 'pi pi-graduation-cap',
          items: subMenu,
        };
        this.items = [...this.items!, newItem];
      }
    });
  }

  logout() {
    localStorage.clear(); // clear tokens or user info
    this.router.navigate(['/teacher-login']); // redirect to login
  }
}
