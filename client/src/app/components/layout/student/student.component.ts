import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student',
  imports: [CommonModule, RouterModule, Menubar, ToastModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {

        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
            this.router.navigate(['/main/student/student-import']);
        }
      },
      {
        label: 'Сурагч нэмэх',
        icon: 'pi pi-star',
        command: () => {
            this.router.navigate(['/main/student/exam']);
        }
      },
      {
        label: 'Projects',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Components',
            icon: 'pi pi-bolt',
            command: () => {
                this.router.navigate(['/main/student/exam-list']);
            }
          },
          {
            label: 'Blocks',
            icon: 'pi pi-server',
            command: () => {
                this.router.navigate(['/main/student/question']);
            }
          },
          {
            label: 'UI Kit',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Templates',
            icon: 'pi pi-palette',
            items: [
              {
                label: 'Apollo',
                icon: 'pi pi-palette'
              },
              {
                label: 'Ultima',
                icon: 'pi pi-palette'
              }
            ]
          }
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope'
      }
    ]
  }
}
