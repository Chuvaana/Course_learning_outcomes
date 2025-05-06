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
export class PdfMainService {

  generatePdfAll(daty: any) {
    const contentArray: any[] = [];

    daty.forEach((data: any, dataIndex: number) => {
      if (!data || !data.assessPlan || !data.content) return;

      const assessPlan = data.assessPlan;
      const content = data.content;
      const assessPlanCount = assessPlan.length + 5;
      const percent = 80 / (assessPlan.length + 3);

      const widths: string[] = ['5%', '15%'];
      for (let i = 0; i < assessPlan.length + 3; i++) {
        widths.push(`${percent.toFixed(2)}%`);
      }

      const dynamicSubHeaders = assessPlan.map((plan: { subMethodName: any; }) => ({
        text: plan.subMethodName,
        alignment: 'center',
        style: 'tableGreen',
      }));

      const dynamicOneColumn = [
        {
          text: data.title,
          alignment: 'center',
          style: 'tableGreen',
          colSpan: assessPlanCount,
        },
        ...Array(assessPlanCount - 1).fill({}),
      ];

      const mainPointHeader = assessPlan.map((plan: { point: any; }) => ({
        text: plan.point,
        alignment: 'center',
        style: 'bodyCenter',
      }));

      const mainPoint = content.map((student: any, index: number) => {
        const row = [
          { text: index + 1, alignment: 'center', style: 'bodyCenter' },
          { text: student.studentName, alignment: 'center', style: 'bodyCenter' },
          ...student.points.map((p: { point: any; }) => ({
            text: p.point,
            alignment: 'center',
            style: 'body',
          })),
          { text: student.totalPoint, alignment: 'center', style: 'body' },
          { text: student.percentage, alignment: 'center', style: 'body' },
          { text: student.letterGrade, alignment: 'center', style: 'body' },
        ];
        return row;
      });

      const tableBody = [
        [
          { text: 'д/д', alignment: 'center', style: 'tableGreen' },
          { text: 'Оюутны нэр/\nүнэлгээний аргууд', alignment: 'center', style: 'tableGreen' },
          ...dynamicSubHeaders,
          { text: 'Нийт оноо', alignment: 'center', style: 'tableGreen' },
          { text: '100%-д шилжүүлсэн оноо', alignment: 'center', style: 'tableGreen' },
          { text: 'Үсгэн үнэлгээ', alignment: 'center', style: 'tableGreen' },
        ],
        dynamicOneColumn,
        [
          { text: 'Авбал зохих оноо', colSpan: 2, alignment: 'center', style: 'title' },
          {},
          ...mainPointHeader,
          { text: data.totalPoint, alignment: 'center', style: 'bodyCenter' },
          { text: '100%', alignment: 'center', style: 'bodyCenter' },
          { text: 'A', alignment: 'center', style: 'bodyCenter' },
        ],
        ...mainPoint,
      ];

      // Append to content
      contentArray.push(
        { text: `Хүснэгт ${dataIndex + 1}. ${data.title}`, style: 'footerCenter'},
        {
          table: {
            headerRows: 3,
            widths,
            body: tableBody,
            dontBreakRows: true,
          },
        },
        { text: `Боловсруулсан багш: ${data.teacherName}`, style: 'footerCenter'}
      );
    });

    const documentDefinition = {
      content: [
        { text: 'Улирлын шалгалтын асуултууд ба хичээлийн\nсуралцахуйн үр дүнгийн хамаарал', style: 'bodyCenter' },
        { text: new Date().toISOString().split('T')[0], style: 'bodyRight' },
        ...contentArray,
      ],
      styles: {
        header: { fontSize: 14, bold: true},
        tableGreen: { fontSize: 10, fontStyle: 'Arial', color: 'black', fillColor: '#D9EADA'},
        tableHeader: { fontSize: 10, fontStyle: 'Times New Roman', bold: true },
        body: { fontSize: 10, bold: false, fontStyle: 'Arial' },
        bodyCenter: { fontSize: 10, bold: false, fontStyle: 'Arial', alignment: 'center' as const },
        title: { fontSize: 11, bold: true, fontStyle: 'Times New Roman', alignment: 'center' as const},
        bodyLeft: { fontSize: 11, alignment: 'left' as const},
        bodyRight: { fontSize: 11, alignment: 'right' as const},
        footerCenter: { fontSize: 12, alignment: 'center' as const},
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
