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
export class PdfCloGeneratorService {


  generatePdf(data: string[]) {
    if (data.length === 0) return;

    let headerRowData: any = {};
    let enterRowData: any = {};

    if (data.length >= 2) {
      headerRowData = data[0];
      enterRowData = data[1];
    }
    const progressPontCount = (enterRowData[0].procPoints?.length || 0);
    const examPointCount = (enterRowData[0].examPoints?.length || 0);

    const procPointsLength = progressPontCount + 3 + examPointCount;

    const lengthValue = procPointsLength; // энэ бол нийт хэдэн багана болж хуваагдхын олох мөн default 3 багана нэмж өгж байгаа

    const percent = 89 / lengthValue; // багана болж хуваагдах хэмжээ

    const widths: string[] = ['3%', '8%'];


    for (let i = 0; i < procPointsLength; i++) {
      widths.push(`${percent.toFixed(2)}%`);
    }


    const defaultHeaders = [
      { text: 'Д/Д', rowSpan: 4, alignment: 'center', style: 'tableHeader' },
      { text: 'Хичээлийн суралцахуйн\nүр дүн (CLOs)\n/Үнэлгээний аргууд', rowSpan: 4, alignment: 'center', style: 'tableHeader' },
    ];

    const dynamicHeaders = headerRowData.plans.flatMap((plan: { subMethods: any[]; methodName: string; methodType: string; }) => {
      const subMethodCount = plan.subMethods.length;
      const headers = [];

      if (plan.methodType === 'EXAM') {
        headers.push({
          text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nявцын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо',
          alignment: 'center',
          style: 'tableGreen',
          rowSpan: 4
        });
      }

      headers.push(
        {
          text: plan.methodName,
          colSpan: subMethodCount,
          alignment: 'center',
          style: getStyleByMethodType(plan.methodType),
        },
        ...Array(subMethodCount - 1).fill({}) // colSpan тул хоёр дахь хоосон {} үүсгэнэ
      );

      return headers;
    });

    const dynamicSubHeaders = headerRowData.plans.flatMap((plan: { subMethods: any[]; methodName: string; methodType: string; }) => {
      const headers = [];

      if (plan.methodType === 'EXAM') {
        headers.push({}); // Улирлын шалгалтаас өмнө нэг хоосон багана оруулах
      }

      const subMethodHeaders = plan.subMethods.map((subMethod) => ({
        text: subMethod.subMethod,
        alignment: 'center',
        style: getStyleByMethodType(plan.methodType),
      }));

      headers.push(...subMethodHeaders); // нэг нэгээр нь push хийх хэрэгтэй

      return headers; // flatMap учраас OK
    });
    const dynamicTopHeaders = [
      {},
      {},
      {
        text: 'Явцын 70 онооны задаргаа /хичээлийн хэлбэрээс хамаарч өөрчлөгдөнө/',
        colSpan: progressPontCount,
        alignment: 'center',
        style: 'tableYellow'
      },
      ...Array(progressPontCount - 1).fill({}), // colSpan тул үлдсэн багануудыг хоосон болгоно
      {},
      {
        text: 'Шалгалтын 30 онооны задаргаа',
        colSpan: examPointCount,
        alignment: 'center',
        style: 'tableYellow'
      },
      ...Array(examPointCount - 1).fill({}), // colSpan тул үлдсэн багануудыг хоосон болгоно
      {},
      {},
    ];

    const dynamicSubPoints = headerRowData.plans.flatMap((plan: { subMethods: any[]; methodName: string; methodType: string; }) => {
      const headers = [];

      if (plan.methodType === 'EXAM') {
        headers.push({}); // Улирлын шалгалтаас өмнө нэг хоосон багана оруулах
      }

      const subMethodHeaders = plan.subMethods.map((subMethod) => ({
        text: subMethod.point,
        alignment: 'center',
        style: getStyleByMethodType(plan.methodType),
      }));

      headers.push(...subMethodHeaders); // нэг нэгээр нь push хийх хэрэгтэй

      return headers; // flatMap учраас OK
    });

    const cloLecColumn = enterRowData.flatMap((clo: any, index: any) => {
      const headers = [];
      const headersData = [];

      // Extract points
      let procAllPoint = 0;
      clo.procPoints.map((procPoints: any) => {
        procAllPoint = procAllPoint + procPoints.point
      });
      let examAllPoint = 0;
      clo.examPoints.map((examPoints: any) => {
        examAllPoint = examAllPoint + examPoints.point
      });
      if (clo.cloType !== 'CLAB') {


        // Sum of all points
        const allPoint = procAllPoint + examAllPoint
        // Push headers
        headers.push({
          text: index + 1,
          alignment: 'center',
          style: 'tableGreen',
        });

        headers.push({
          text: clo.cloName,
          alignment: 'center',
          style: 'tableGreen',
        });

        // Process procPoints
        const subMethodproc = clo.procPoints.map((procPoints: any) => ({
          text: procPoints.point,
          alignment: 'center',
          style: 'tableBlue',
        }));
        headers.push(...subMethodproc); // Add procPoints headers

        // Add sum of procPoints
        headers.push({
          text: procAllPoint,
          alignment: 'center',
          style: 'tableGreen',
        });

        // Process examPoints
        const subMethodExam = clo.examPoints.map((examPoints: any) => ({
          text: examPoints.point,
          alignment: 'center',
          style: 'tableBlue',
        }));
        headers.push(...subMethodExam); // Add examPoints headers

        // Add sum of examPoints
        headers.push({
          text: examAllPoint,
          alignment: 'center',
          style: 'tableGreen',
        });

        // Add total sum of all points
        headers.push({
          text: allPoint,
          alignment: 'center',
          style: 'tableGreen',
        });
        headersData.push(headers);
      }

      return headersData; // flatMap works to flatten the headers into a single array
    });
    const cloLabColumn = enterRowData.flatMap((clo: any, index: any) => {
      const headers = [];
      const headersData = [];

      // Extract points
      let procAllPoint = 0;
      clo.procPoints.map((procPoints: any) => {
        procAllPoint = procAllPoint + procPoints.point
      });
      let examAllPoint = 0;
      clo.examPoints.map((examPoints: any) => {
        examAllPoint = examAllPoint + examPoints.point
      });

      if (clo.cloType === 'CLAB') {
        // Sum of all points
        const allPoint = procAllPoint + examAllPoint
        // Push headers
        headers.push({
          text: index + 1,
          alignment: 'center',
          style: 'tableGreen',
        });

        headers.push({
          text: clo.cloName,
          alignment: 'center',
          style: 'tableGreen',
        });

        // Process procPoints
        const subMethodproc = clo.procPoints.map((procPoints: any) => ({
          text: procPoints.point,
          alignment: 'center',
          style: 'tableBlue',
        }));
        headers.push(...subMethodproc); // Add procPoints headers

        // Add sum of procPoints
        headers.push({
          text: procAllPoint,
          alignment: 'center',
          style: 'tableGreen',
        });

        // Process examPoints
        const subMethodExam = clo.examPoints.map((examPoints: any) => ({
          text: examPoints.point,
          alignment: 'center',
          style: 'tableBlue',
        }));
        headers.push(...subMethodExam); // Add examPoints headers

        // Add sum of examPoints
        headers.push({
          text: examAllPoint,
          alignment: 'center',
          style: 'tableGreen',
        });

        // Add total sum of all points
        headers.push({
          text: allPoint,
          alignment: 'center',
          style: 'tableGreen',
        });
        headersData.push(headers);
      }
      return headersData; // flatMap works to flatten the headers into a single array
    });

    function getStyleByMethodType(methodType: string): string {
      switch (methodType) {
        case 'PARTI':
          return 'tableYellow';
        case 'QUIZ1':
        case 'QUIZ2':
          return 'tableBlue';
        case 'PROC':
          return 'tableOrange';
        case 'EXAM':
          return 'tableGreen';
        default:
          return 'tableDefault'; // default style
      }
    }
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
    const cloAssesment = [
      // Header row
      [
        { text: 'Д/Д', rowSpan: 4, alignment: 'center', style: 'tableHeader' },
        { text: 'Хичээлийн суралцахуйн\nүр дүн (CLOs)\n/Үнэлгээний аргууд', rowSpan: 4, alignment: 'center', style: 'tableHeader' },
        ...dynamicHeaders,
        // { text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nявцын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо', rowSpan: 4, alignment: 'center', style: 'tableYellow' },
        { text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nшалгалтын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо', rowSpan: 4, alignment: 'center', style: 'tableYellow' },
        { text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо\n/явц+шалгалт/', rowSpan: 4, alignment: 'center', style: 'tableBlue' }
      ],
      [
        {},
        {},
        ...dynamicSubHeaders,
        {},
        {},
      ],
      [
        ...dynamicTopHeaders,
      ],
      [
        {},
        {},
        ...dynamicSubPoints,
        {},
        {},
      ],
      [
        { text: 'Лекц семинарын хичээлээр эзэмшсэн суралцхуйн үр дүнгүүд', colSpan: procPointsLength + 2, alignment: 'center', style: 'tableGoldenYellow' },
        ...Array((procPointsLength + 2) - 1).fill({}),
      ],
      ...cloLecColumn.map((row: any) => {
        // Ensure row.stack is an array or return an empty array if it's not
        return Array.isArray(row) ? row : [];
      }),
      [
        { text: 'Лабораторийн хичээлээр эзэмшсэн суралцхуйн үр дүнгүүд', colSpan: procPointsLength + 2, alignment: 'center', style: 'tableGoldenYellow' },
        ...Array((procPointsLength + 2) - 1).fill({}),
      ],
      ...cloLabColumn.map((row: any) => {
        // Ensure row.stack is an array or return an empty array if it's not
        return Array.isArray(row) ? row : [];
      })
    ];

    const tableBody = [
      [
        { text: 'д/д', alignment: 'center', style: 'tableGreen' },
        { text: 'Оюутны нэр/\nүнэлгээний аргууд', alignment: 'center', style: 'tableGreen' },
        { text: 'Цаг төлөвлөлт, хариуцлага', alignment: 'center', style: 'tableGreen' },
        { text: 'Мэдлэгээ сэргээн санах,\nтайлбарлах', alignment: 'center', style: 'tableGreen' },
        { text: 'Асуудал шийдвэрлэхэд\nмэдлэгээ хэрэглэх, задлан\nшинжлэх', alignment: 'center', style: 'tableGreen' },
        { text: 'Мэдлэгээ сэргээн санах,\nтайлбарлах', alignment: 'center', style: 'tableGreen' },
        { text: 'Асуудал шийдвэрлэхэд\nмэдлэгээ хэрэглэх, задлан', alignment: 'center', style: 'tableGreen' },
        { text: 'Өгөгдсөн даалгаварын хүрээнд\nшийдвэрлэх асуудлаа\nтодорхойлж томъёолох', alignment: 'center', style: 'tableGreen' },
        { text: 'Шийдвэрлэх асуудлын хүрээнд\nтодорхой ши йдэл дэвшүүлэх,\nдүн шинжилгээ хийх', alignment: 'center', style: 'tableGreen' },
        { text: 'Мэдлэг, ур чадвараа ашиглан\nсонгосон шийдлын дагуу', alignment: 'center', style: 'tableGreen' },
        { text: 'Бичгийн болон харилцах ур\nчадвараа ашиглан үр дүнг\nөгөгдсөн форматын дагуу', alignment: 'center', style: 'tableGreen' },
        { text: 'Сэргээн санах/ойлгох түвшин', alignment: 'center', style: 'tableGreen' },
        { text: 'Үнэлэх/ бүтээх түвшин', alignment: 'center', style: 'tableGreen' },
        { text: 'Нийт оноо', alignment: 'center', style: 'tableGreen' },
        { text: '100%-д шилжүүлсэн оноо', alignment: 'center', style: 'tableGreen' },
        { text: 'Үсгэн үнэлгээ', alignment: 'center', style: 'tableGreen' },
      ],
      [
        { text: 'Математикийн ойлголтыг дүрс боловсруулалтад хэрэглэх;', colSpan: 16, alignment: 'center', style: 'tableGreen' },
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
      ],
      [
        { text: 'Авбал зохих оноо', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '3', alignment: 'center', style: 'tableHeader' },
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '2', alignment: 'center', style: 'tableHeader' },
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '1', alignment: 'center', style: 'tableHeader' },
        { text: '2', alignment: 'center', style: 'tableHeader' },
        { text: '15', alignment: 'center', style: 'tableHeader' },
        { text: '100%', alignment: 'center', style: 'tableHeader' },
        { text: 'A', alignment: 'center', style: 'tableHeader' },
      ],
    ];
    // Dynamically generate widths based on number of columns
    const documentDefinition = {
      pageOrientation: 'landscape' as const,
      content: [
        { text: '4.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮДИЙН ҮНЭЛГЭЭНИЙ ТӨЛӨВЛӨЛТ ', fontSize: 12, bold: true, margin: [0, 0, 0, 5] as [number, number, number, number] },
        {
          text: [
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
            widths: widths,
            body: cloAssesment,
          },
        },
        {
          text: '5.	ХИЧЭЭЛИЙН ШУУД БА ШУУД БУС ҮНЭЛГЭЭНИЙ ҮР ДҮН ',
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 5] as [number, number, number, number],
          pageBreak: 'before' as any,
          pageOrientation: 'portrait' as const
        },
        {
          text: '5.1.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ  ',
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 5] as [number, number, number, number]
        },
        {
          text: '<Хүснэгт 4-д үзүүлсэн төлөвлөлтөд үндэслэн хичээлийн тухайн суралцахуйн үр дүн (CLOs)-нд харгалзах үнэлгээний аргыг (1-15 хүртэлх) түүвэрлэн, харгалзах гүйцэтгэлийн оноог оюутан бүрээр гаргана. Жишээ загварыг хүснэгт 5-аас 6-д үзүүлэв.>',
          margin: [0, 0, 0, 5] as [number, number, number, number],
          style: 'bodyRed'
        },
        {
          text: '5.1.1.	ТУХАЙН CLO-Д ХАРГАЛЗАХ ОЮУТНЫ ГҮЙЦЭТГЭЛИЙН ҮНЭЛГЭЭ',
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 5] as [number, number, number, number]
        },
        { text: 'Хүснэгт 5. CLO-1 суралцахуйн үр дүнгийн оюутны гүйцэтгэлийн үнэлгээ', style: 'bodyCenter' },
        {
          table: {
            headerRows: 1,
            widths: ['4%', '12%',
              '6%', '6%', '6%', '6%',
              '6%', '6%', '6%', '6%', '6%',
              '6%', '6%', '6%', '6%', '6%'],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        tableYellow: {
          fontSize: 4,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#FFF2CC',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableBlue: {
          fontSize: 4,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#D9E1F2',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableGreen: {
          fontSize: 4,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#E2EFDA',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableOrange: {
          fontSize: 4,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#F8CBAD',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableGoldenYellow: {
          fontSize: 4,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#FFFF00',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableHeader: {
          fontSize: 4,
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
