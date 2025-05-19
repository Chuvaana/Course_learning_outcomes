import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ToastModule,
    SidebarModule,
    RouterModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() lessonId: string = '';
  sidebarVisible: boolean = false;

  items: MenuItem[] | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.items = [
      {
        label: 'Ерөнхий тохиргоо',
        icon: 'pi pi-check',
        routerLink: ['/main/admin/config'],
      },
      // {
      //   label: 'PLO тохиргоо',
      //   icon: 'pi pi-check',
      //   routerLink: ['/main/admin/plo'],
      // },
      {
        label: 'Үйл үгний тохиргоо',
        icon: 'pi pi-check',
        routerLink: ['/main/admin/verb'],
      },
      // {
      //   label: 'Оюутны бүртгэлийн тохиргоо',
      //   icon: 'pi pi-check',
      //   routerLink: ['/main/admin/student-import'],
      // },
    ];
  }

  // Function to open sidebar
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
