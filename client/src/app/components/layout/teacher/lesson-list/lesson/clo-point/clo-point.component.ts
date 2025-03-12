import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-clo-point',
  standalone: true,
  imports: [TableModule, ToastModule, CommonModule, TagModule, SelectModule, ButtonModule, InputTextModule, FormsModule, InputNumberModule],
  templateUrl: './clo-point.component.html',
  styleUrl: './clo-point.component.scss'
})
export class CloPointComponent {
  headerPoints = [
    { name: 'Цаг төлөвлөлт, хариуцлага', value: 5 },
    { name: 'Суралцах хүсэл эрмэлзэл, өөрийгээ илэрхийлэх', value: 5 },
    { name: 'Мэдлэгээ сэргээн санах, тайлбарлах', value: 5 },
    { name: 'Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх', value: 10 },
    { name: 'Мэдлэгээ сэргээн санах, тайлбарлах', value: 5 },
    { name: 'Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх', value: 10 },
    { name: 'Лабораторийн хэмжилт, туршилт, даалгавар гүйцэтгэх', value: 5 },
    { name: 'Үр дүнг тохирох аргаар өгөгдсөн форматын дагуу  боловсруулж, тайлагнах', value: 10 },
    { name: 'Өгөгдсөн даалгаварын хүрээнд шийдвэрлэх асуудлаа тодорхойлж томъёолох', value: 15 },
    { name: 'Шийдвэрлэх асуудлын хүрээнд тодорхой шийдэл дэвшүүлэх, дүн шинжилгээ хийх', value: 15 },
    { name: 'Мэдлэг, ур чадвараа ашиглан сонгосон шийдлын дагуу асуудлыг шийдвэрлэх', value: 15 },
    { name: 'Бичгийн болон харилцах ур чадвараа ашиглан үр дүнг өгөгдсөн форматын дагуу тайлагнах, илтгэх', value: 15 },
    { name: 'Бичгийн болон харилцах ур чадвараа ашиглан үр дүнг өгөгдсөн форматын дагуу тайлагнах, илтгэх', value: 15 },
    { name: 'Сэргээн санах/ойлгох түвшин', value: 15 },
    { name: 'Хэрэглэх /дүн шинжилгээ хийх түвшин', value: 15 },
    { name: 'Үнэлэх/ бүтээх түвшин', value: 15 }
  ];

  categories = [
    { name: 'Хичээлийн идэвхи, оролцоо', key: 'time' },
    { name: 'Явцын сорил 1', key: 'engagement' },
    { name: 'Явцын сорил 2', key: 'recall' },
    { name: 'Лабораторийн ажил, туршилт', key: 'problemSolving' },
    { name: 'Даалгавар', key: 'decisionMaking' },
    { name: 'Явцын үнэлгээний харгалзах нийлбэр оноо', key: 'communication' }
  ];

  cloData = [
    { CLOs: 'Engineering Application', time: 5, engagement: 5, recall: 5, problemSolving: 10, decisionMaking: 5, communication: 10 },
    { CLOs: 'Problem Solving', time: 5, engagement: 5, recall: 10, problemSolving: 5, decisionMaking: 15, communication: 5 }
  ];

  savePoints() {
    console.log('Saved Header Points:', this.headerPoints);
  }

  saveCloScores() {
    console.log('Saved CLO Scores:', this.cloData);
  }
}
