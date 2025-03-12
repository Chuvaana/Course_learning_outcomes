import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Menu, ToastModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'CLO',
        icon: 'pi pi-plus',
        url: '/main/teacher/lesson/clo'
      },
      {
        label: 'CLO-point',
        icon: 'pi pi-plus',
        url: '/main/teacher/lesson/clo-point'
      },
      {
        label: 'Хичээлийн хөтөлбөр',
        icon: 'pi pi-plus'
      },
      {
        label: 'Төлөвлөгөө',
        icon: 'pi pi-plus'
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
      // {
      //   label: 'CLO',
      //   items: [
      //     {
      //       label: 'New',
      //       icon: 'pi pi-plus'
      //     },
      //     {
      //       label: 'Search',
      //       icon: 'pi pi-search'
      //     }
      //   ]
      // },
      // {
      //   label: 'Profile',
      //   items: [
      //     {
      //       label: 'Settings',
      //       icon: 'pi pi-cog'
      //     },
      //     {
      //       label: 'Logout',
      //       icon: 'pi pi-sign-out'
      //     }
      //   ]
      // }
    ];
  }
}
