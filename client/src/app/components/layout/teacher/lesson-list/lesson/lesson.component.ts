import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-lesson',
  imports: [RouterModule, TieredMenuModule, ToastModule],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss'
})
export class LessonComponent {
  lessonId: string = '';
  items: MenuItem[] | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.items = [
      {
        label: 'Хичээлийн хөтөлбөр',
        icon: 'pi pi-book',
        // url: '/main/teacher/curriculum'
        routerLink: ['/main/teacher/curriculum', this.lessonId]
      },
      {
        label: 'Дүнгийн төлөвлөлт',
        icon: 'pi pi-check',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-plan']
      },
      {
        label: 'Дүнгийн төлөвлөлт2',
        icon: 'pi pi-check',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-point']
      },
      {
        label: 'Дүнгийн төлөвлөлт3',
        icon: 'pi pi-check',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-tree']
      },
      {
        label: 'Оюутан',
        icon: 'pi pi-graduation-cap',
        items: [
          {
            label: 'Жагсаалт',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'studentList']
          },
          {
            label: 'Бүртгэх',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/main/teacher/lesson', this.lessonId, 'student']
          }
        ]
      },
      {
        label: 'Ирц',
        icon: 'pi pi-plus',
        routerLink: ['/main/teacher/lesson', this.lessonId, 'attendance']
      },
      {
        label: 'ХИЧЭЭЛИЙН АГУУЛГА, ЦАГИЙН ХУВААРИЛАЛТ',
        icon: 'pi pi-plus',
        url: '/main/teacher/lesson/syllabus/schedule'
      }
    ];
  }
}
