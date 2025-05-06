import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})

export class TestComponent {
  qrCodeValue: string = 'studentId=123&lessonId=456';
  // Ирцийн мэдээ хадгалах зориулалттай объект
  // attendanceData = {
  //   studentId: '12345',
  //   name: 'John Doe',
  //   subject: 'Mathematics',
  //   timestamp: new Date().toISOString()
  // };

  // // QR кодыг үүсгэх мэдээлэл
  // // qrCodeValue: string;

  // constructor() {
  //   // QR кодонд оруулах мэдээллийг форматлах
  //   this.qrCodeValue = JSON.stringify(this.attendanceData);
  // }
}
