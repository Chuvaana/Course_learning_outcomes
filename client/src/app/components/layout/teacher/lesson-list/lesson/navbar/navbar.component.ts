import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToastModule, SidebarModule, RouterModule, ButtonModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() lessonId: string = '';
  sidebarVisible: boolean = false;

  // Menu items
  items = [
    {
      label: 'Хичээлийн хөтөлбөр',
      icon: 'pi pi-plus',
      routerLink: ['/main/teacher/curriculum', this.lessonId]
    },
    {
      label: 'Хөтөлбөр',
      icon: 'pi pi-plus',
      routerLink: ['/main/teacher/lesson', this.lessonId, 'clo-plan']
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
      label: 'ХИЧЭЭЛИЙН АГУУЛГА, ЦАГИЙН ХУВААРИЛТ',
      icon: 'pi pi-plus',
      url: '/main/teacher/lesson/syllabus/schedule'
    }
  ];

  // Function to open sidebar
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
