import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacherService';
import { MenuComponent } from './menu/menu.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss'
})
export class TeacherComponent {

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    public dialogRef: MatDialogRef<TeacherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    console.log(this.data);
  }

}
