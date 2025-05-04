import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs } from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PdfExamQuestionService {


  generatePdf(data: any) {
    // if (data.length === 0) return;
    console.log(data.clos);
    // const testPart2Exists = data.testData.some((row: { testPart: number }) => row.testPart === 2);

    const allPont = [
      {
        title: '1',
        point: 5,
      },
      {
        title: '2',
        point: 5,
      },
      {
        title: '3',
        point: 5,
      },
      {
        title: '4',
        point: 5,
      },
    ]
    const mainTableData = [
      // Header row
      [
        { text: 'Хичээлийн нэр', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.lessonName, alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Хичээлийн код', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.lessonCode, alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Хичээлийн кредит', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.lessonCredit, alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Салбар/Тэнхим', alignment: 'left', style: 'tableHeader' },
        { text: data.mainInfo.lessonCode, alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Сургалтын нийт цаг', alignment: 'left', style: 'tableHeader' },
        { text: 'Лекц ('+ data.mainInfo.totalHours.lecture+'цаг),Лаборатори ('+ data.mainInfo.totalHours.lab+' цаг), Бие даан суралцах ('+ data.mainInfo.totalHours.practice+' цаг)', alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Шалгалтын хэлбэр', alignment: 'left', style: 'tableHeader' },
        { text: data.finalExams.examType, alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Хувилбарын тоо', alignment: 'left', style: 'tableHeader' },
        { text: data.finalExamQuestions.length, alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Шалгалт өгөх оюутны тоо', alignment: 'left', style: 'tableHeader' },
        { text: data.finalExams.examTakeStudentCount, alignment: 'left', style: 'body' }
      ],
      [
        { text: 'Шалгалтаар үнэлэх суралцахуйн үр дүнгүүд (CLOs)', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {}
      ],
      ...data.cloList.map((row: { cloName: any; }) => [
        {
          text: row.cloName,
          alignment: 'left',
          style: 'tableHeader'

        },
        {
          text: row.cloName,
          alignment: 'left',
          style: 'body'
        },
      ]),
    ];
    const tableBody = [
      // TITLE row
      [
        { text: 'Асуулт', alignment: 'center', style: 'tableHeader' },
        { text: 'Үйл үг', alignment: 'center', style: 'tableHeader' },
        { text: 'Блумын түвшин', alignment: 'center', style: 'tableHeader' },
        { text: 'Аль CLO-г үнэлэх', alignment: 'center', style: 'tableHeader' }
      ],
      [
        { text: 'Тестийн 1-р хэсэг', colSpan: 4, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        {},
      ],
      ...data.finalExamQuestions
        .filter((row: { version: string; }) => row.version === '1').map((row: {
          CloLevel: any; blmLvl: any; verbName: any; cloName: any;
        }, index: number) => [
            {
              text: index + 1,
              alignment: 'center',
              style: 'body'

            },
            {
              text: row.verbName,
              alignment: 'left',
              style: 'body'

            },
            {
              text: row.blmLvl,
              alignment: 'center',
              style: 'body'
            },
            {
              text: row.cloName,
              alignment: 'center',
              style: 'body'
            },
          ]),
          ...(data.finalExamQuestions.some((row: { version: string }) => row.version === '2')
          ? [[
              { text: 'Тестийн 2-р хэсэг', colSpan: 4, alignment: 'center', style: 'tableHeader' },
              {}, {}, {}
            ]]
          : []
        ),
          ...data.finalExamQuestions
        .filter((row: { version: string; }) => row.version === '2').map((row: {
          CloLevel: any; blmLvl: any; verbName: any; cloName: any;
        }, index: number) => [
            {
              text: index + 1,
              alignment: 'center',
              style: 'body'

            },
            {
              text: row.verbName,
              alignment: 'left',
              style: 'body'

            },
            {
              text: row.blmLvl,
              alignment: 'center',
              style: 'body'
            },
            {
              text: row.cloName,
              alignment: 'center',
              style: 'body'
            },
          ]),
    ];
    // Dynamically generate widths based on number of columns
    const documentDefinition = {
      content: [
        { text: 'Улирлын шалгалтын асуултууд ба хичээлийн\nсуралцахуйн үр дүнгийн хамаарал', style: 'bodyCenter' },
        { text: '2024-12-18', style: 'bodyRight' },
        { text: '1.	Үндсэн мэдээлэл', style: 'bodyLeft' },
        {
          table: {
            headerRows: 1,
            widths: ['30%', '70%'],
            body: mainTableData,
            dontBreakRows: true,
          },
        },
        { text: '2.	Шалгалтын асуултуудын үйл үг, Блумын түвшин ба CLO-ийн хамаарал', style: 'bodyMiddleCenter' },
        {
          table: {
            headerRows: 1,
            widths: ['10%', '60%', '15%', '15%'],
            body: tableBody,
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
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyCenter: {
          fontSize: 12,
          bold: true,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
          margin: [0, 0, 0, 10] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        footerCenter: {
          fontSize: 10,
          bold: true,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
          margin: [0, 0, 0, 10] as [number, number, number, number] // ✅ Force it to be a tuple
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
}
