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
export class PdfLessonAssessmentService {


  generatePdf(data: any) {
    if (data.length === 0) return;

    const assessPlan = data.assessPlan;
    const content = data.content;

    const assessPlanCount = assessPlan.length + 5;

    const percent = 80 / (assessPlan.length + 3);

    const widths: string[] = ['5%', '15%'];

    for (let i = 0; i < assessPlan.length + 3; i++) {
      widths.push(`${percent.toFixed(2)}%`);
    }

    console.log(widths);

    const dynamicSubHeaders = assessPlan.flatMap((plan: { subMethods: any[]; subMethodName: string; methodType: string; }) => {
      const headers = [];
      headers.push(
        {
          text: plan.subMethodName,
          alignment: 'center',
          style: 'tableGreen',
        },
      );

      return headers;
    });

    const dynamicOneColumn = [
      {
        text: data.title,
        alignment: 'center',
        style: 'tableGreen',
        colSpan: assessPlanCount,
      },
      ...Array(assessPlanCount - 1).fill({})
    ];

    const mainPointHeader = assessPlan.flatMap((plan: { subMethods: any[]; subMethodName: string; point: any; }) => {
      const headers = [];
      headers.push(
        {
          text: plan.point,
          alignment: 'center',
          style: getStyleByMethodType(),
        },
      );

      return headers;
    });

    const mainPoint = content.flatMap(
      (plan: {
        totalPoint: any;
        percentage: any;
        letterGrade: any;
        points: any[];
        studentName: string;
        point: any;
      }, index: number) => {
        const row: any[] = [];

        row.push({
          text: index + 1,
          alignment: 'center',
          style: 'bodyCenter',
        });

        row.push({
          text: plan.studentName,
          alignment: 'center',
          style: 'bodyCenter',
        });

        const subPoints = plan.points.map((point) => ({
          text: point.point,
          alignment: 'center',
          style: 'body',
        }));
        row.push(...subPoints);

        row.push({
          text: plan.totalPoint,
          alignment: 'center',
          style: 'body',
        });

        row.push({
          text: plan.percentage,
          alignment: 'center',
          style: 'body',
        });

        row.push({
          text: plan.letterGrade,
          alignment: 'center',
          style: 'body',
        });

        return [row];
      }
    );

    console.log(mainPoint);

    function getStyleByMethodType(): string {
      return 'bodyCenter'; // default style
    }
    const mainTableData =
      [
        [
          {
            text: 'д/д',
            alignment: 'center',
            style: 'tableGreen'
          },
          {
            text: 'Оюутны нэр/\nүнэлгээний аргууд',
            alignment: 'center',
            style: 'tableGreen'
          },
          ...dynamicSubHeaders,
          {
            text: 'Нийт оноо',
            alignment: 'center',
            style: 'tableGreen'
          },
          {
            text: '100%-д шилжүүлсэн оноо',
            alignment: 'center',
            style: 'tableGreen'
          },
          {
            text: 'Үсгэн үнэлгээ',
            alignment: 'center',
            style: 'tableGreen'
          },
        ],
        [
          ...dynamicOneColumn,
        ],
        [
          {
            text: 'Авбал зохих оноо',
            colSpan: 2,
            alignment: 'center',
            style: 'title'
          },
          {},
          ...mainPointHeader,
          {
            text: data.totalPoint,
            alignment: 'center',
            style: 'bodyCenter'
          },
          {
            text: '100%',
            alignment: 'center',
            style: 'bodyCenter'
          },
          {
            text: 'A',
            alignment: 'center',
            style: 'bodyCenter'
          },
        ],
          ...mainPoint,
      ];

    const documentDefinition = {
      content: [
        { text: 'Улирлын шалгалтын асуултууд ба хичээлийн\nсуралцахуйн үр дүнгийн хамаарал', style: 'bodyCenter' },
        { text: '2024-12-18', style: 'bodyRight' },
        { text: '1.	Үндсэн мэдээлэл', style: 'bodyLeft' },
        {
          table: {
            headerRows: 1,
            widths: widths,
            body: mainTableData,
            dontBreakRows: true,
          },
        },
      ],
      footer: {
        text: `Боловсруулсан багш ........ ................... ${data.teacherName}`,
        style: 'footerCenter',
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        tableGreen: {
          fontSize: 10,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#D9EADA',
          padding: [0, 0, 0, 0] as [number, number, number, number],
        },
        tableHeader: {
          fontSize: 10,
          fontStyle: 'Times New Roman',
          bold: true,
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        body: {
          fontSize: 10,
          bold: false,
          fontStyle: 'Arial',
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyCenter: {
          fontSize: 10,
          bold: false,
          fontStyle: 'Arial',
          alignment: 'center' as const,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        title: {
          fontSize: 11,
          bold: true,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyMiddleCenter: {
          fontSize: 10,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
          margin: [0, 15, 0, 15] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyLeft: {
          fontSize: 10,
          fontStyle: 'Times New Roman',
          alignment: 'left' as const,
          margin: [20, 0, 0, 1] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyRight: {
          fontSize: 10,
          fontStyle: 'Times New Roman',
          alignment: 'right' as const,
          margin: [0, 0, 0, 10] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyRed: {
          fontSize: 11,
          fontStyle: 'Times New Roman',
          color: 'red',
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        }
      }
    };

    pdfMake.createPdf(documentDefinition).open(); // ✅ No more TypeScript errors!
  }


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
            pageBreak: 'before' as any,
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
