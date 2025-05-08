import { keyframes, style } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { Injectable } from '@angular/core';
import { AbstractFormGroupDirective } from '@angular/forms';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs } from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PdfHeaderTitleService {
  constructor() { }

  // Helper to convert image URL to base64
  private getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    return fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }

  async generatePdfAll(daty: any) {

    const base64Image = await this.getBase64ImageFromUrl('assets/img/logo.png');

    const contentArray: any[] = [];
    const liveDate = new Date();
    const formattedDate = liveDate.toISOString().split('T')[0];

    const tableBody = [
      // Header row
      [
        {
          text: 'Тайлан гаргасан:',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Гарын үсэг',
          alignment: 'center',
          style: 'body',
        },
        {
          text: 'Огноо : '+formattedDate,
          alignment: 'right',
          style: 'body',
        },
      ],
      [
        {
          text: '.................\n/Хичээл заасан багш/',
          alignment: 'left',
          style: 'body',
        },
        {},
        {},
      ],
      [
        {
          text: 'Тайланг хянасан:',
          alignment: 'left',
          style: 'body',
        },
        {},
        {
          text: 'Огноо : '+formattedDate,
          alignment: 'right',
          style: 'body',
        },
      ],
      [
        {
          text: '.................\n/Салбарын эрхлэгч/',
          alignment: 'left',
          style: 'body',
        },
        {},
        {},
      ],
    ];

    const documentDefinition = {
      content: [
        { text: 'ШИНЖЛЭХ УХААН ТЕХНОЛОГИЙН ИХ СУРГУУЛЬ', style: 'mainTitleStyle' },
        {
          image: base64Image, width: 100, style: 'image'
        },
        { text: 'ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ҮНЭЛГЭЭНИЙ ТАЙЛАН', style: 'mainTitleStyle' },
        { text: 'Хичээлийн нэр: Зургын боловсруулалт', style: 'leftMargin' },
        { text: 'Хичээлийн жил: 2023-2024 оны хаврын улирал', style: 'leftMargin' },
        {
          table: {
            // headerRows: 1,
            widths: [
              '33%',
              '34%',
              '33%',
            ],
            body: tableBody,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          margin: [0, 100, 0, 0] as [number, number, number, number],
        },
      ],
      styles: {
        header: { fontSize: 14, bold: true },
        mainTitleStyle: { fontSize: 14, bold: true, alignment: 'center' as const, margin: [0, 0, 0, 50] as [number, number, number, number], },
        image: { alignment: 'center' as const, margin: [0, 70, 0, 120] as [number, number, number, number], },
        leftMargin: { fontSize: 10, bold: false, alignment: 'left' as const, margin: [50, 10, 0, 0] as [number, number, number, number], },
        tableGreen: { fontSize: 10, fontStyle: 'Arial', color: 'black', fillColor: '#D9EADA' },
        tableHeader: { fontSize: 10, fontStyle: 'Times New Roman', bold: true },
        body: { fontSize: 10, bold: false, fontStyle: 'Arial' },
        bodyCenter: { fontSize: 10, bold: false, fontStyle: 'Arial', alignment: 'center' as const },
        title: { fontSize: 11, bold: true, fontStyle: 'Times New Roman', alignment: 'center' as const },
        bodyLeft: { fontSize: 11, alignment: 'left' as const },
        bodyRight: { fontSize: 11, alignment: 'right' as const },
        footerCenter: { fontSize: 12, alignment: 'center' as const },
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
