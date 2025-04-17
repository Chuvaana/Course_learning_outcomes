import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
})
export class TeacherComponent {}
