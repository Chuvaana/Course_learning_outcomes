import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { Menubar } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-lesson',
  imports: [
    RouterModule,
    TieredMenuModule,
    ToastModule,
    TabsModule,
    AvatarModule,
    BadgeModule,
    MenuModule,
    CommonModule,
    RouterModule,
    Menubar,
  ],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss',
})
export class LessonComponent {
  items: MenuItem[] | undefined;

  lessonId: string = '';
  constructor(private router: Router, private actRoute: ActivatedRoute) {}

  ngOnInit() {
    this.lessonId = this.actRoute.snapshot.paramMap.get('id') || '';

    this.items = [
      {
        label: 'Эхлэл',
        icon: 'pi pi-home',
        routerLink: ['/main/student/lesson-list'],
      },
      {
        label: 'Төлөвлөгөө',
        icon: 'pi pi-home',
        routerLink: ['/main/student', this.lessonId, 'plan'],
      },
      {
        label: 'Шалгалт өгөх',
        icon: 'pi pi-star',
        command: () => {
          this.router.navigate(['/main/student/exam']);
        },
      },
      {
        label: 'Дүн харах',
        icon: 'pi pi-star',
        command: () => {
          this.router.navigate(['/main/student/exam']);
        },
      },
      {
        label: 'Ирц явцын оноо харах',
        icon: 'pi pi-star',
        command: () => {
          this.router.navigate(['/main/student/exam']);
        },
      },
      {
        label: 'Санал асуулга өгөх',
        icon: 'pi pi-star',
        routerLink: ['/main/student', this.lessonId, 'exam-progress-poll'],
      },
      {
        separator: true,
      },
      {
        label: 'Гарах',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
        styleClass: 'logout-button', // This class will be used for custom styling if needed
      },
    ];
  }
  logout() {
    localStorage.clear(); // clear tokens or user info
    this.router.navigate(['/student-login']); // redirect to login
  }
}
