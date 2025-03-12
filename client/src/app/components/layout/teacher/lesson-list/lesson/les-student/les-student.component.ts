import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TeacherService } from '../../../../../../services/teacherService';
import { MessageService, SelectItem } from 'primeng/api';

@Component({
  selector: 'app-les-student',
  standalone: true,
  imports: [TableModule, ToastModule, CommonModule, TagModule, SelectModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './les-student.component.html',
  styleUrl: './les-student.component.scss'
})
export class LesStudentComponent {
  cloData = [
    { ID: 1, CLOs: 'Engineering Application', 'Time Management': 'Good', Engagement: 'Active', Recall: 5, 'Problem Solving': 10, 'Recall 2': 5, 'Problem Solving 2': 10, 'Decision Making': 'Yes', Communication: 'Excellent', 'Final Score (100%)': 85, 'Letter Grade': 'A' },
    { ID: 2, CLOs: 'Problem Solving', 'Time Management': 'Moderate', Engagement: 'Medium', Recall: 7, 'Problem Solving': 8, 'Recall 2': 6, 'Problem Solving 2': 9, 'Decision Making': 'Partial', Communication: 'Good', 'Final Score (100%)': 75, 'Letter Grade': 'B' },
  ];
}
