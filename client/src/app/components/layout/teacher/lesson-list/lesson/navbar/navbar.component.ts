import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PanelMenu, ToastModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

  @Input() lessonId: string = '';

  ngOnInit() {
    this.items = [  
      // {
      //   label: 'Үнэлгээний төлөвлөлт',
      //   items: [
      //     {
      //       label: 'Ерөнхий',
      //       icon: 'pi pi-plus',
      //       routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-point']
      //       // url: '/main/teacher/lesson/clo-point'
      //     },
      //     {
      //       label: 'Суралцахуйн үнэлгээ',
      //       icon: 'pi pi-stop',
      //       url: '/main/teacher/lesson/clo-plan'
      //     },
      //     {
      //       label: 'Сэдэв',
      //       icon: 'pi pi-check-circle'
      //     }
      //   ],
      // },
      {
        label: 'Хичээлийн хөтөлбөр',
        icon: 'pi pi-plus',
        // url: '/main/teacher/curriculum'
        routerLink: ['/main/teacher/curriculum', this.lessonId]
      },
      {
        label: 'Дүн',
        icon: 'pi pi-plus'
      },
      {
        label: 'Оюутан',
        icon: 'pi pi-plus',
        url: '/main/teacher/lesson/student'
      },
      {
        label: 'Ирц',
        icon: 'pi pi-plus',
        url: '/main/teacher/lesson/student'
      },
      {
        label: 'ХИЧЭЭЛИЙН АГУУЛГА, ЦАГИЙН ХУВААРИЛАЛТ',
        icon: 'pi pi-plus',
        url: '/main/teacher/lesson/syllabus/schedule'
      }
    ];
  }
}
