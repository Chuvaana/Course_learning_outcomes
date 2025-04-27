import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-student',
  imports: [ TabsModule, AvatarModule, BadgeModule, MenuModule, CommonModule, RouterModule, Menubar, ToastModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  items: MenuItem[] | undefined;

  studentId: string = '';
  constructor(private router: Router, private actRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.studentId = this.actRoute.snapshot.paramMap.get('id') || '';

    this.items = [
      {

        label: 'Эхлэл',
        icon: 'pi pi-home',
        command: () => {
            this.router.navigate(['/main/student/student-app-menu']);
        }
      },
      {
        label: 'Шалгалт өгөх',
        icon: 'pi pi-star',
        command: () => {
            this.router.navigate(['/main/student/exam']);
        }
      },
      {
        label: 'Дүн харах',
        icon: 'pi pi-star',
        command: () => {
            this.router.navigate(['/main/student/exam']);
        }
      },
      {
        label: 'Ирц явцын оноо харах',
        icon: 'pi pi-star',
        command: () => {
            this.router.navigate(['/main/student/exam']);
        }
      },
      {
        label: 'Санал асуулга өгөх',
        icon: 'pi pi-star',
        command: () => {
            this.router.navigate(['/main/student/67f21da15d1c9f9efbf37dd9/exam-progress-poll']);
        }
      },
      {
        separator: true
      },
      {
        label: 'Гарах',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
        styleClass: 'logout-button'  // This class will be used for custom styling if needed
      }
    ]
  }
  logout() {
    localStorage.clear(); // clear tokens or user info
    this.router.navigate(['/student-login']); // redirect to login
  }
}
