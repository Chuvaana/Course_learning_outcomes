import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { RegLogService } from '../../../../../services/regLogService';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    Image,
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    CardModule,
    ToastModule,
    PanelModule,
    FormsModule,
    ButtonModule,
    MenuModule],
  providers: [MessageService],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent implements OnInit {

  dataModul: FormGroup;
  inData: any;
  teacherId: any;
  saveData: any;
  isActive = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    private fb: FormBuilder,
    private dialog: MatDialogRef<PasswordResetComponent>,
    private route: ActivatedRoute,
    private service: RegLogService,
    private msgService: MessageService
  ) {
    this.dataModul = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      branch: ['', Validators.required],
      department: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/),
        ],
      ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.inData = data;
  }
  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  ngOnInit() {
    this.dataModul.value.email = this.inData.email;
    this.items = [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Search',
        icon: 'pi pi-search'
      },
      {
        separator: true
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      }
    ];
  }

  submitButton() {
    this.service.findGmailTeacher(this.dataModul.value.email).subscribe(
      (data: { message: string; teacher: any }) => {
        this.teacherId = data.teacher.id;
        this.saveData = data.teacher;
        this.isActive = true;
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай бүртгэгдлээ',
        });
      },
      (error) => {
        let errorMessage = 'Error registering teacher';
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: `Алдаа гарлаа: ${errorMessage}`,
        });
      }
    );
  }
  resetPassButton() {
    if (this.dataModul.value.password === this.dataModul.value.confirmPassword) {
      this.dataModul.value.name = this.saveData.name;
      this.dataModul.value.code = this.saveData.code;
      this.dataModul.value.branch = this.saveData.branch;
      this.dataModul.value.department = this.saveData.department;
      this.isActive = true;
      this.service.changePassword(this.teacherId, this.dataModul.value).subscribe(
        (data: { message: string; teacher: any }) => {
          this.isActive = true;
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай бүртгэгдлээ',
          });
          this.dialog.close();
        },
        (error) => {
          let errorMessage = 'Error registering teacher';
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Алдаа гарлаа: ${errorMessage}`,
          });
        }
      );
    } else {
      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: `Давтаж оруулсан нууц үг зөрч байна!`,
      });
    }
  }

  returnScreen() {
    this.dialog.close();
  }
}
