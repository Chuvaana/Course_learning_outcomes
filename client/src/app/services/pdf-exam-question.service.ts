import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';

@Injectable({
  providedIn: 'root',
})
export class PdfExamQuestionService {
  generatePdf(data: any) {
    console.log(data.clos);
    let cloListData: any[] = [];
    data.cloList.map((row: { cloName: any }, index: any) => {
      index = index + 1;
      const data = {
        name: 'CLO ' + index,
        code: row.cloName,
        order: index,
      };
      cloListData.push(data);
    });
    const versions = [
      ...new Set(data.finalExamQuestions.map((q: any) => q.version)),
    ];

    const questionSectionRows = versions.flatMap((version) => {
      const filtered = data.finalExamQuestions.filter(
        (q: any) => q.version === version
      );
      if (filtered.length === 0) return [];

      const headerRow = [
        {
          text: `Тестийн ${version}-р хэсэг`,
          colSpan: 4,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {},
      ];

      const questionRows = filtered.map((row: any, index: number) => {
        const matchedClo = cloListData.find((clo) => clo.code === row.cloName);
        return [
          { text: index + 1, alignment: 'center', style: 'body' },
          { text: row.verbName, alignment: 'left', style: 'body' },
          { text: row.blmLvl, alignment: 'center', style: 'body' },
          {
            text: matchedClo ? matchedClo.name : 'N/A',
            alignment: 'center',
            style: 'body',
          },
        ];
      });

      return [headerRow, ...questionRows];
    });

    const mainTableData = [
      [
        { text: 'Хичээлийн нэр', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.lessonName, alignment: 'left', style: 'body' },
      ],
      [
        { text: 'Хичээлийн код', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.lessonCode, alignment: 'left', style: 'body' },
      ],
      [
        { text: 'Хичээлийн кредит', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.lessonCredit, alignment: 'left', style: 'body' },
      ],
      [
        { text: 'Салбар/Тэнхим', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.department, alignment: 'left', style: 'body' },
      ],
      [
        { text: 'Сургалтын нийт цаг', alignment: 'left', style: 'tableHeader' },
        {
          text:
            'Лекц (' +
            data.mainInfo.totalHours.lecture +
            'цаг)Семинар (' +
            data.mainInfo.totalHours.seminar +
            'цаг),Лаборатори (' +
            data.mainInfo.totalHours.lab +
            ' цаг), Бие даан суралцах (' +
            data.mainInfo.totalHours.assignment +
            ' цаг)',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        { text: 'Шалгалтын хэлбэр', alignment: 'left', style: 'tableHeader' },
        { text: data.finalExams.examType, alignment: 'left', style: 'body' },
      ],
      [
        { text: 'Хувилбарын тоо', alignment: 'left', style: 'tableHeader' },
        {
          text: data.finalExamQuestions.length,
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Шалгалт өгөх оюутны тоо',
          alignment: 'left',
          style: 'tableHeader',
        },
        {
          text: data.finalExams.examTakeStudentCount,
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Шалгалтаар үнэлэх суралцахуйн үр дүнгүүд (CLOs)',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
      ],
      ...data.cloList.map((row: { cloName: any }, index: any) => [
        {
          text: cloListData[index].name,
          alignment: 'left',
          style: 'tableHeader',
        },
        {
          text: row.cloName,
          alignment: 'left',
          style: 'body',
        },
      ]),
    ];
    const tableBody = [
      [
        { text: 'Асуулт', alignment: 'center', style: 'tableHeader' },
        { text: 'Үйл үг', alignment: 'center', style: 'tableHeader' },
        { text: 'Блумын түвшин', alignment: 'center', style: 'tableHeader' },
        { text: 'Аль CLO-г үнэлэх', alignment: 'center', style: 'tableHeader' },
      ],
      ...questionSectionRows,
    ];
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    const documentDefinition = {
      content: [
        {
          text: 'Улирлын шалгалтын асуултууд ба хичээлийн\nсуралцахуйн үр дүнгийн хамаарал',
          style: 'bodyCenter',
        },
        { text: formatted, style: 'bodyRight' },
        { text: '1.	Үндсэн мэдээлэл', style: 'bodyLeft' },
        {
          table: {
            headerRows: 1,
            widths: ['30%', '70%'],
            body: mainTableData,
            dontBreakRows: true,
          },
        },
        {
          text: '2.	Шалгалтын асуултуудын үйл үг, Блумын түвшин ба CLO-ийн хамаарал',
          style: 'bodyMiddleCenter',
        },
        {
          table: {
            headerRows: 1,
            widths: ['10%', '60%', '15%', '15%'],
            body: tableBody,
            dontBreakRows: true,
          },
        },
      ],
      footer: (currentPage: number, pageCount: number): any => {
        if (currentPage === pageCount) {
          return {
            text: `Боловсруулсан багш ........................... ${data.mainInfo.teacher.name}`,
            style: 'footerCenter',
          };
        }
        return {};
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        tableYellow: {
          fontSize: 11,
          fontStyle: 'Times New Roman',
          color: 'black',
          fillColor: '#FFF2CC',
          padding: [0, 10, 0, 0] as [number, number, number, number],
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
          fontStyle: 'Times New Roman',
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        bodyCenter: {
          fontSize: 12,
          bold: true,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
          margin: [0, 0, 0, 10] as [number, number, number, number],
        },
        footerCenter: {
          fontSize: 10,
          bold: true,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
          margin: [0, 0, 0, 10] as [number, number, number, number],
        },
        bodyMiddleCenter: {
          fontSize: 10,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
          margin: [0, 15, 0, 15] as [number, number, number, number],
        },
        bodyLeft: {
          fontSize: 10,
          fontStyle: 'Times New Roman',
          alignment: 'left' as const,
          margin: [20, 0, 0, 1] as [number, number, number, number],
        },
        bodyRight: {
          fontSize: 10,
          fontStyle: 'Times New Roman',
          alignment: 'right' as const,
          margin: [0, 0, 0, 10] as [number, number, number, number],
        },
        bodyRed: {
          fontSize: 11,
          fontStyle: 'Times New Roman',
          color: 'red',
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
