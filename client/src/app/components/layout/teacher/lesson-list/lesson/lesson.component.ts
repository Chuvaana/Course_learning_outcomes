import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { MenuComponent } from '../../menu/menu.component';
@Component({
  selector: 'app-lesson',
  imports: [RouterModule, TieredMenuModule, ToastModule, MenuComponent],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss',
})
export class LessonComponent {
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
        label: 'Явцын үнэлгээ',
        icon: 'pi pi-plus',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'progress-poll'],
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
