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
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        url: '/',
      },
      {
        label: 'Хичээл',
        icon: 'pi pi-book',
        url: '/main/teacher/lessonList',
      },
      {
        label: 'Шалгалт',
        icon: 'pi pi-star',
        url: '/main/teacher/question-create',
      },
      {
        label: 'Санал асуулга',
        icon: 'pi pi-star',
        url: '/',
      },
      {
        label: 'Асуултын жагсаалт',
        icon: 'pi pi-star',
        url: '/main/teacher/questionlist',
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
