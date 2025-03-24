import { Injectable } from '@angular/core';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs } from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfCloGeneratorService {


  generatePdf(data: string[][]) {
    if (data.length === 0) return;

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
    const tableBody = [
      // Header row
      [
        { text: 'Д/Д', rowSpan: 4, alignment: 'center', style: 'tableHeader' },
        { text: 'Хичээлийн суралцахуйн\nүр дүн (CLOs)\n/Үнэлгээний аргууд', rowSpan: 4, alignment: 'center', style: 'tableHeader' },
        { text: 'Хичээлийн идэвхи,\nоролцоо', colSpan: 2, alignment: 'center', style: 'tableYellow' },
        {},
        { text: 'Явцын сорил 1', colSpan: 2, alignment: 'center', style: 'tableBlue' },
        {},
        { text: 'Явцын сорил 2', colSpan: 2, alignment: 'center', style: 'tableGreen' },
        {},
        { text: 'Лабораторийн ажил,\nтуршилт', colSpan: 2, alignment: 'center', style: 'tableOrange' },
        {},
        { text: 'Даалгавар\n/Бие даалтын ажил, курсын ажил,\nтөсөл гэх мэт/', colSpan: 4, alignment: 'center', style: 'tableGreen' },
        {},
        {},
        {},
        { text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nявцын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо', rowSpan: 4, alignment: 'center', style: 'tableYellow' },
        { text: 'Улирлын шалгалт', colSpan: 3, alignment: 'center', style: 'tableGreen' },
        {},
        {},
        { text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nшалгалтын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо', rowSpan: 4, alignment: 'center', style: 'tableYellow' },
        { text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо\n/явц+шалгалт/', rowSpan: 4, alignment: 'center', style: 'tableBlue' }
      ],
      [
        {},
        {},
        { text: 'Цаг\nтөлөвлөлт,\nхариуцлага', alignment: 'center', style: 'tableYellow' },
        { text: 'Суралцах\nхүсэл\nэрмэлзэл,\nөөрийгээ\nилэрхийлэх', alignment: 'center', style: 'tableYellow' },
        { text: 'Мэдлэгээ\nсэргээн\nсанах,\nтайлбарлах',alignment: 'center', style: 'tableBlue' },
        { text: 'Асуудал\nшийдвэрлэхэд\nмэдлэгээ\nхэрэглэх,\nзадлан\nшинжлэх',alignment: 'center', style: 'tableBlue' },
        { text: 'Мэдлэгээ\nсэргээн\nсанах,\nтайлбарлах',alignment: 'center', style: 'tableGreen' },
        { text: 'Асуудал\nшийдвэрлэхэд\nмэдлэгээ\nхэрэглэх,\nзадлан\nшинжлэх',alignment: 'center', style: 'tableGreen' },
        { text: 'Лабораторийн\nхэмжилт,\nхэрэглэх,\nдаалгавар\nгүйцэтгэх',alignment: 'center', style: 'tableOrange' },
        { text: 'Үр дүнг тохирох\nаргаар өгөгдсөн\nформатын\nдагуу\nболовсруулж,\nтайлагнах',alignment: 'center', style: 'tableOrange' },
        { text: 'Өгөгдсөн\nдаалгаварын\nхүрээнд\nшийдвэрлэх\nасуудлаа\nтодорхойлж\nтомъёолох',alignment: 'center', style: 'tableGreen' },
        { text: 'Шийдвэрлэх\nасуудлын\nхүрээнд\nтодорхой\nшийдэл\nдэвшүүлэх,\nдүн\nшинжилгээ\nхийх', alignment: 'center', style: 'tableGreen' },
        { text: 'Мэдлэг, ур\nчадвараа\nашиглан\nсонгосон\nшийдлын\nдагуу\nасуудлыг\nшийдвэрлэх', alignment: 'center', style: 'tableGreen' },
        { text: 'Бичгийн болон\nхарилцах ур\nчадвараа\nашиглан үр\nдүнг өгөгдсөн\nформатын\nдагуу\nтайлагнах,\nилтгэх', alignment: 'center', style: 'tableGreen' },
        {},
        { text: 'Сэргээн\nсанах/ойлгох\nтүвшин', alignment: 'center', style: 'tableGreen' },
        { text: 'Хэрэглэх\n/дүн\nшинжилгээ\nхийх түвшин', alignment: 'center', style: 'tableOrange' },
        { text: 'Үнэлэх/\nбүтээх\nтүвшин', alignment: 'center', style: 'tableGreen' },
        {},
        {}
      ],
      [
        {},
        {},
        { text: 'Явцын 70 онооны задаргаа /хичээлийн хэлбэрээс хамаарч өөрчлөгдөнө/',colSpan: 12, alignment: 'center', style: 'tableYellow' },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Шалгалтын 30 онооны задаргаа',colSpan:3 , alignment: 'center', style: 'tableGreen' },
        {},
        {},
        {},
        {}
      ],
      [
        {},
        {},
        { text: '5', alignment: 'center', style: 'tableYellow' },
        { text: '5', alignment: 'center', style: 'tableYellow' },
        { text: '5', alignment: 'center', style: 'tableBlue' },
        { text: '5', alignment: 'center', style: 'tableBlue' },
        { text: '5', alignment: 'center', style: 'tableBlue' },
        { text: '5', alignment: 'center', style: 'tableBlue' },
        { text: '15', alignment: 'center', style: 'tableOrange' },
        { text: '5', alignment: 'center', style: 'tableOrange' },
        { text: '5', alignment: 'center', style: 'tableGreen' },
        { text: '5', alignment: 'center', style: 'tableGreen' },
        { text: '5', alignment: 'center', style: 'tableGreen' },
        { text: '5', alignment: 'center', style: 'tableGreen' },
        {},
        { text: '5', alignment: 'center', style: 'tableGreen' },
        { text: '10', alignment: 'center', style: 'tableOrange' },
        { text: '15', alignment: 'center', style: 'tableGreen' },
        {},
        {}
      ],
      [
        { text: 'Лекц семинарын хичээлээр эзэмшсэн суралцхуйн үр дүнгүүд',colSpan: 20, alignment: 'center', style: 'tableGoldenYellow' },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { text: 'Лабораторийн хичээлээр эзэмшсэн суралцхуйн үр дүнгүүд',colSpan: 20, alignment: 'center', style: 'tableGoldenYellow' },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
    ];

    // Dynamically generate widths based on number of columns
    const documentDefinition = {
      pageOrientation: 'landscape' as const,
      content: [
        { text: '4.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮДИЙН ҮНЭЛГЭЭНИЙ ТӨЛӨВЛӨЛТ ', fontSize: 12, bold: true, margin: [0, 0, 0, 5] as [number, number, number, number]},
        { text: [
          { text: '<Энд UNIMIS системд оруулсан хичээлийн үнэлгээний 15 задаргаанд харгалзах оноо нь хичээлийн суралцахуйн үр дүнгүүдийн алийг үнэлэх, түүнд оноог хэрхэн хуваарилах төлөвлөлтийг хийнэ. Дагалдах', style: 'bodyRed' },
          { text: '70.30-CLOs-khamaaral.xls ', style: 'body' },
          { text: 'файлын төлөвлөлт хуудсыг ашиглан хичээлийн суралцахуйн үр дүнгийн онооны хуваарилалтыг хийж тайлангийн файл руу хуулж оруулна. Харин тус файлын гүйцэтгэл хуудсыг үр дүн тооцоолоход ашиглаж болно>', style: 'bodyRed' }
        ]
      },
        { text: ' ', style: 'bodyCenter' },
        { text: 'Хүснэгт 4. Хичээлийн суралцахуйн үр дүнгийн шууд үнэлгээний онооны хуваарилалт/төлөвлөлтөөр/', style: 'bodyCenter' },
        {
          table: {
            headerRows: 1,
            widths: ['2%','8%','5%','5%','5%',
                     '5%','5%','5%','5%','5%',
                     '5%','5%','5%','5%','5%',
                     '5%','5%','5%','5%','5%'],
            body: tableBody,
          },
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        tableYellow: {
          fontSize: 5,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#FFF2CC',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableBlue: {
          fontSize: 5,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#D9E1F2',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableGreen: {
          fontSize: 5,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#E2EFDA',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableOrange: {
          fontSize: 5,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#F8CBAD',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableGoldenYellow: {
          fontSize: 5,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#FFFF00',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableHeader: {
          fontSize: 5,
          fontStyle: 'Arial',
          color: 'black',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        body: {
          fontSize: 10,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyCenter: {
          fontSize: 10,
          alignment: 'center' as const,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        bodyRed: {
          fontSize: 10,
          color: 'red',
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        }
      }
    };

    pdfMake.createPdf(documentDefinition).open(); // ✅ No more TypeScript errors!
  }
}
