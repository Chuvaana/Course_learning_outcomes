import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        url: '/'
      },
      {
        label: 'Хичээл',
        icon: 'pi pi-star',
        // url: '/main/teacher/lessonList'
        items: [
          {
            label: 'CLO',
            // icon: 'pi pi-plus',
            url: '/main/teacher/lesson/clo'
          },  {
            label: 'Үнэлгээний төлөвлөлт',
            items: [
              {
                label: 'Ерөнхий',
                // icon: 'pi pi-plus',
                url: '/main/teacher/lesson/clo-point'
              },
              {
                label: 'Суралцахуйн үнэлгээ',
                // icon: 'pi pi-stop',
                url: '/main/teacher/lesson/clo-plan'
              },
              {
                label: 'Сэдэв',
                // icon: 'pi pi-check-circle'
              }
            ],
          },
          {
            label: 'ХИЧЭЭЛИЙН АГУУЛГА, ЦАГИЙН ХУВААРИЛАЛТ',
            // icon: 'pi pi-plus',
            url: '/main/teacher/lesson/syllabus/schedule'
          },
          {
            label: 'Хичээлийн хөтөлбөр',
            // icon: 'pi pi-plus'
            url: '/main/teacher/curriculum'
          },
        ]
      },
      {
        label: 'Шалгалт',
        icon: 'pi pi-star',
        url: '/main/student/exam-list'
      },
      {
        label: 'Санал асуулга',
        icon: 'pi pi-star',
        url: '/'
      },
      // {
      //   label: 'Шалгалт',
      //   icon: 'pi pi-search',
      //   items: [
      //     {
      //       label: 'Core',
      //       icon: 'pi pi-bolt',
      //       shortcut: '⌘+S'
      //     },
      //     {
      //       label: 'Blocks',
      //       icon: 'pi pi-server',
      //       shortcut: '⌘+B'
      //     },
      //     {
      //       label: 'UI Kit',
      //       icon: 'pi pi-pencil',
      //       shortcut: '⌘+U'
      //     },
      //     {
      //       separator: true
      //     },
      //     {
      //       label: 'Templates',
      //       icon: 'pi pi-palette',
      //       items: [
      //         {
      //           label: 'Apollo',
      //           icon: 'pi pi-palette',
      //           badge: '2'
      //         },
      //         {
      //           label: 'Ultima',
      //           icon: 'pi pi-palette',
      //           badge: '3'
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   label: 'Contact',
      //   icon: 'pi pi-envelope',
      //   badge: '3'
      // }
    ];
  }
}
