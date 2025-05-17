import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [TableModule, ToastModule, CommonModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
  levels = [
    {
      level: 6,
      english: 'CREATE',
      mongolian: 'БҮТЭЭХ',
      verbs: [
        { en: 'create', mn: 'бүтээх' },
        { en: 'invent', mn: 'зохион бүтээх' },
        { en: 'design', mn: 'загварчлах' },
        { en: 'modify', mn: 'шинэчлэх' },
        { en: 'develop', mn: 'боловсруулах' },
        { en: 'write', mn: 'шинэчлэн бичих' },
      ],
    },
    {
      level: 5,
      english: 'EVALUATE',
      mongolian: 'ҮНЭЛЭХ',
      verbs: [
        { en: 'criticize', mn: 'шүүн хэлэлцэх' },
        { en: 'reframe', mn: 'дахин загварчлах' },
        { en: 'judge', mn: 'шүүн тунгаах' },
        { en: 'prioritize', mn: 'зэрэглэл тогтоох' },
        { en: 'plan', mn: 'төлөвлөх' },
      ],
    },
    {
      level: 4,
      english: 'ANALYZE',
      mongolian: 'ЗАДЛАН ШИНЖЛЭХ',
      verbs: [
        { en: 'contrast', mn: 'ялгах' },
        { en: 'connect', mn: 'холбох' },
        { en: 'correlate', mn: 'хамаарлыг тогтоох' },
        { en: 'illustrate', mn: 'дүрслэх' },
        { en: 'conclude', mn: 'дүгнэх' },
        { en: 'categorize', mn: 'ангилах' },
      ],
    },
    {
      level: 3,
      english: 'APPLY',
      mongolian: 'ХЭРЭГЛЭХ',
      verbs: [
        { en: 'solve', mn: 'шийдэх' },
        { en: 'change', mn: 'загварчлах' },
        { en: 'complete', mn: 'даалгаврыг хэрэгжүүлэх' },
        { en: 'sketch', mn: 'загвар гаргах' },
        { en: 'teach', mn: 'заах' },
        { en: 'discover', mn: 'олж илрүүлэх' },
      ],
    },
    {
      level: 2,
      english: 'UNDERSTAND',
      mongolian: 'ОЙЛГОХ',
      verbs: [
        { en: 'summarize', mn: 'дүгнэх' },
        { en: 'classify', mn: 'ангилах' },
        { en: 'compare', mn: 'харьцуулах' },
        { en: 'paraphrase', mn: 'орлуулах' },
        { en: 'relate', mn: 'хамаарлыг тодорхойлох' },
      ],
    },
    {
      level: 1,
      english: 'KNOWLEDGE',
      mongolian: 'МЭДЭХ',
      verbs: [
        { en: 'define', mn: 'тодорхойлох' },
        { en: 'describe', mn: 'тайлбарлах' },
        { en: 'explain', mn: 'тайлбарлах' },
        { en: 'illustrate', mn: 'дүрслэх' },
        { en: 'recognize', mn: 'таних' },
      ],
    },
  ];
}
