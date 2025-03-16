import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacherService';
import { MenuComponent } from './menu/menu.component';
@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss'
})
export class TeacherComponent {

  constructor(private fb: FormBuilder, private teacherService: TeacherService) {
  }
}
