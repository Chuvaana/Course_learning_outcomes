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
        { text: `Хүснэгт ${dataIndex + 1}. ${data.title}`, style: 'footerCenter' },
        {
          table: {
            headerRows: 3,
            widths,
            body: tableBody,
            dontBreakRows: true,
          },
        },
        { text: `Боловсруулсан багш: ${data.teacherName}`, style: 'footerCenter' }
      );
    });


    let headerRowData: any = {};
    let enterRowData: any = {};

    if (daty.length >= 2) {
      headerRowData = daty[0];
      enterRowData = daty[1];
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

    console.log('pdfMain : ' + dynamicHeaders);
    console.log('pdfMain : ' + dynamicTopHeaders);
    console.log('pdfMain : ' + dynamicSubHeaders);
    console.log('pdfMain : ' + cloLecColumn);
    console.log('pdfMain : ' + cloLabColumn);
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
    const cloAssesment = [
      // Header row
      [
        { text: 'Д/Д', rowSpan: 4, alignment: 'center', style: 'tableCloHeader' },
        { text: 'Хичээлийн суралцахуйн\nүр дүн (CLOs)\n/Үнэлгээний аргууд', rowSpan: 4, alignment: 'center', style: 'tableCloHeader' },
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
      ...cloLecColumn.map((row: any, index: any) => {
        return Array.isArray(row) ? row : [];
        // Ensure row.stack is an array or return an empty array if it's not
      }),
      [
        { text: 'Лабораторийн хичээлээр эзэмшсэн суралцхуйн үр дүнгүүд', colSpan: procPointsLength + 2, alignment: 'center', style: 'tableGoldenYellow' },
        ...Array((procPointsLength + 2) - 1).fill({}),
      ],
      ...cloLabColumn.map((row: any, index: any) => {
        // Ensure row.stack is an array or return an empty array if it's not
        return Array.isArray(row) ? row : [];
      })
    ];



    const base64Image = await this.getBase64ImageFromUrl('assets/img/logo.png');

    const liveDate = new Date();
    const formattedDate = liveDate.toISOString().split('T')[0];

    const cloTable = [

      [
        {
          text: 'Оюутан лекц, семинарын хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:',
          colSpan: 2,
          alignment: 'left',
          style: 'body',
        },
        {},
      ],
      [
        {
          text: '1',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Математикийн ойлголтыг дүрс боловсруулалтад хэрэглэх;',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: '2',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Зургийн боловсруулалтын хэрэгсэлүүдийг онцлог домайнд хэрхэн хэрэгжүүлэх ойлголт авах, тайлбарлах',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: '3',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Практик асуудлыг шийдвэрлэхийн тулд алгоритмыг төлөвлөх, хэрэгжүүлэх замаар дүрс боловсруулалтын мэдлэгийг харуулах',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: '4',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Дүрс боловсруулалтын чиглэлээр хийгдэж байгаа шинэ судалгааны ажлуудтай танилцах, мэдэх',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Оюутан лабораторийн хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:',
          colSpan: 2,
          alignment: 'left',
          style: 'body',
        },
        {},
      ],
      [
        {
          text: '5',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Зураг боловсруулах сантай ажиллан зураг боловсруулах аргуудыг хэрэглэх',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: '6',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Онолын мэдлэг дээр тулгуурлан практик асуудлуудыг шийдвэрлэх.',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: '7',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Бие даан туршилт судалгаан дээр суурилсан өгүүлэл бичих ба үр дүн харьцуулах.',
          alignment: 'left',
          style: 'body',
        },
      ],
    ];
    const lessonDetailTable = [
      [
        {
          text: 'Хичээлийн нэр',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Зургын боловсруулалт',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Хичээлийн код',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'CS328',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Хичээлийн кредит',
          alignment: 'left',
          style: 'body',
        },
        {
          text: '3',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Хичээлийн төрөл',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Мэргэшүүлэх, сонгон',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Харьяалагдах салбар/Тэнхим',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Компьютерийн ухааны салбар',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Хичээл заасан багш',
          alignment: 'left',
          style: 'body',
        },
        {
          text: 'Ж.Оргил ',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Хичээл заасан улирал',
          alignment: 'left',
          style: 'body',
        },
        {
          text: '3Б',
          alignment: 'left',
          style: 'body',
        },
      ],
      [
        {
          text: 'Хичээл судалсан оюутны тоо',
          alignment: 'left',
          style: 'body',
        },
        {
          text: '18',
          alignment: 'left',
          style: 'body',
        },
      ],

    ]
    const unifiedCriteTable = [
      [
        {
          text: 'Шаардлага\nбүрэн хангасан\n\n\n (A)',
          alignment: 'center',
          style: 'body',
        },
        {
          text: 'Шаардлага хангасан,\nзарим талаар\nсайжруулалт хийж\nболно\n(В)',
          alignment: 'center',
          style: 'body',
        },
        {
          text: 'Шаардлага\nхангасан, гэхдээ\nсайжруулалт хийх\nхэрэгтэй\n(С)',
          alignment: 'center',
          style: 'body',
        },
        {
          text: 'Шаардлага хангаагүй,\nзаавал сайжруулалт\nхийх хэрэгтэй\n\n(D)',
          alignment: 'center',
          style: 'body',
        },
      ],
      [
        {
          text: 'Шууд үнэлгээ',
          alignment: 'center',
          colSpan: 4,
          style: 'body',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'CLO бүрийн хувьд А, В, С+ ба С үнэлгээ авсан оюутны эзлэх хувь',
          alignment: 'center',
          colSpan: 4,
          style: 'body',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: '91-100',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '81-90',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '70-80',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '<70',
          alignment: 'center',
          style: 'body',
        },
      ],
      [
        {
          text: 'Шууд бус үнэлгээ',
          alignment: 'center',
          colSpan: 4,
          style: 'body',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'CLO бүрийн хувьд санал асуулгын 4 ба 5 оноо бүхий\nхариултын эзлэх хувь',
          alignment: 'center',
          colSpan: 4,
          style: 'body',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: '91-100',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '81-90',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '70-80',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '<70',
          alignment: 'center',
          style: 'body',
        },
      ],
      [
        {
          text: 'Хичээлийн санал асуулгын бусад асуултуудын хувьд 3-5 оноо бүхий\nхариултын эзлэх хувь',
          alignment: 'center',
          colSpan: 4,
          style: 'body',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: '91-100',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '81-90',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '70-80',
          alignment: 'center',
          style: 'body',
        },
        {
          text: '<70',
          alignment: 'center',
          style: 'body',
        },
      ],
    ]
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
          text: 'Огноо : ' + formattedDate,
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
          text: 'Огноо : ' + formattedDate,
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

    const contentAssessmentArray: any[] = [];
    daty[2].forEach((data: any, dataIndex: number) => {
      if (!data || !data.assessPlan || !data.content) return;

      let assessPlanAssessment: any[] = [];
      let contentAssessment: any[]  = [];
      if(data.assessPlan.length > 0){
        assessPlanAssessment = data.assessPlan;
        contentAssessment = data.content;
      }else{
        return;
      }
      const assessPlanAssessmentCount = assessPlanAssessment.length + 5;
      const percentAssessment = 80 / (assessPlanAssessment.length + 3);

      const widthsAssessment: string[] = ['5%', '15%'];
      for (let i = 0; i < assessPlanAssessment.length + 3; i++) {
        widthsAssessment.push(`${percentAssessment.toFixed(2)}%`);
      }

      const dynamicSubHeadersAssessment = assessPlanAssessment.map((plan: { subMethodName: any; }) => ({
        text: plan.subMethodName,
        alignment: 'center',
        style: 'tableGreenAssessment',
      }));

      const dynamicOneColumnAssessment = [
        {
          text: data.title,
          alignment: 'center',
          style: 'tableGreenAssessment',
          colSpan: assessPlanAssessmentCount,
        },
        ...Array(assessPlanAssessmentCount - 1).fill({}),
      ];

      const mainPointHeaderAssessment = assessPlanAssessment.map((plan: { point: any; }) => ({
        text: plan.point,
        alignment: 'center',
        style: 'bodyCenterAssessment',
      }));

      const mainPointAssessment = contentAssessment.map((student: any, index: number) => {
        const row = [
          { text: index + 1, alignment: 'center', style: 'bodyCenterAssessment' },
          { text: student.studentName, alignment: 'center', style: 'bodyCenterAssessment' },
          ...student.points.map((p: { point: any; }) => ({
            text: p.point,
            alignment: 'center',
            style: 'bodyAssessment',
          })),
          { text: student.totalPoint, alignment: 'center', style: 'bodyAssessment' },
          { text: student.percentage, alignment: 'center', style: 'bodyAssessment' },
          { text: student.letterGrade, alignment: 'center', style: 'bodyAssessment' },
        ];
        return row;
      });

      const tableBodyAssessment = [
        [
          { text: 'д/д', alignment: 'center', style: 'tableGreenAssessment' },
          { text: 'Оюутны нэр/\nүнэлгээний аргууд', alignment: 'center', style: 'tableGreenAssessment' },
          ...dynamicSubHeadersAssessment,
          { text: 'Нийт оноо', alignment: 'center', style: 'tableGreenAssessment' },
          { text: '100%-д шилжүүлсэн оноо', alignment: 'center', style: 'tableGreenAssessment' },
          { text: 'Үсгэн үнэлгээ', alignment: 'center', style: 'tableGreenAssessment' },
        ],
        dynamicOneColumnAssessment,
        [
          { text: 'Авбал зохих оноо', colSpan: 2, alignment: 'center', style: 'titleAssessment' },
          {},
          ...mainPointHeaderAssessment,
          { text: data.totalPoint, alignment: 'center', style: 'bodyCenterAssessment' },
          { text: '100%', alignment: 'center', style: 'bodyCenterAssessment' },
          { text: 'A', alignment: 'center', style: 'bodyCenterAssessment' },
        ],
        ...mainPointAssessment,
      ];

      // Append to contentAssessment
      contentAssessmentArray.push(
        { text: `Хүснэгт ${dataIndex + 5}. ${data.title}`, style: 'bodyRightInBold', margin: [20, 20, 20, 5] as [number, number, number, number]},
        {
          table: {
            headerRows: 0, // Don't repeat headers on new pages
            widths: widthsAssessment,
            body: tableBodyAssessment,
            dontBreakRows: true,
            pageBreak: 'before' as any,
            pageOrientation: 'landscape' as const
          },
        },
        { text: '', pageBreak: 'before' as const },
      );
    });

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
        { text: '', pageBreak: 'before' as const },
        { text: 'Агуулга', style: 'headerTitle', margin: [0, 50, 0, 10] as [number, number, number, number] },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              [{ text: '1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГ ҮНЭЛЭХ ЕРӨНХИЙ ЗАРЧИМ', fontSize: 10, bold: true }, { text: '3' }],
              [{ text: '2. ХИЧЭЭЛИЙН ЕРӨНХИЙ МЭДЭЭЛЭЛ', fontSize: 10, bold: true }, { text: '4' }],
              [{ text: '3. ХИЧЭЭЛЭЭР ЭЗЭМШИХ СУРАЛЦАХУЙН ҮР ДҮНГҮҮД', fontSize: 10, bold: true }, { text: '4' }],
              [{ text: '4. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮДИЙН ҮНЭЛГЭЭНИЙ ТӨЛӨВЛӨЛТ', fontSize: 10, bold: true }, { text: '5' }],
              [{ text: '5. ХИЧЭЭЛИЙН ШУУД БА ШУУД БУС ҮНЭЛГЭЭНИЙ ҮР ДҮН', fontSize: 10, bold: true }, { text: '6' }],
              [{ text: '   5.1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ', fontSize: 10 }, { text: '6' }],
              [{ text: '      5.1.1. ТУХАЙН CLO-Д ХАРГАЛЗАХ ОЮУТНЫ ГҮЙЦЭТГЭЛИЙН ҮНЭЛГЭЭ', fontSize: 10 }, { text: '6' }],
              [{ text: '      5.1.2. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ҮНЭЛГЭЭНИЙ НЭГДСЭН ҮЗҮҮЛЭЛТ', fontSize: 10 }, { text: '7' }],
              [{ text: '   5.2. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД БУС ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ', fontSize: 10 }, { text: '8' }],
              [{ text: '      5.2.1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН САНАЛ АСУУЛГЫН ДҮН', fontSize: 10 }, { text: '8' }],
              [{ text: '      5.2.2. CLOs-ИЙН САНАЛ АСУУЛГЫН ҮР ДҮНГИЙН ГРАФИК ҮЗҮҮЛЭЛТ', fontSize: 10 }, { text: '8' }],
              [{ text: '   5.3. ШУУД БА ШУУД БУС ҮНЭЛГЭЭНИЙ НЭГДСЭН ҮЗҮҮЛЭЛТ', fontSize: 10 }, { text: '9' }],
              [{ text: '6. САНАЛ АСУУЛГЫН БУСАД ҮР ДҮНГҮҮДЭД ХИЙСЭН ДҮН ШИНЖИЛГЭЭ', fontSize: 10, bold: true }, { text: '9' }],
              [{ text: '7. СУРАЛЦАХУЙН ҮР ДҮНГИЙН ГҮЙЦЭТГЭЛИЙГ САЙЖРУУЛАХ ТӨЛӨВЛӨЛТ', fontSize: 10, bold: true }, { text: '9' }],
              [{ text: '   7.1. ХИЧЭЭЛИЙН ОНЦЛОГ, ДАВУУ ТАЛУУД', fontSize: 10 }, { text: '9' }],
              [{ text: '   7.2. ХИЧЭЭЛИЙН СУЛ ТАЛУУД', fontSize: 10 }, { text: '10' }],
              [{ text: '   7.3. СУРАЛЦАХУЙН ҮР ДҮНГИЙН ГҮЙЦЭТГЭЛИЙГ ДЭЭШЛҮҮЛЭХ ЧИГЛЭЛЭЭР ХИЙХ АЖЛЫН ТӨЛӨВЛӨЛТ', fontSize: 10 }, { text: '10' }],
              [{ text: '8. ХАВСРАЛТ 1. ХИЧЭЭЛИЙН САНАЛ АСУУЛГЫН ЗАГВАР', fontSize: 10, bold: true }, { text: '12' }],
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0
          }
        },
        { text: '', pageBreak: 'before' as const },
        {
          text: '1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГ ҮНЭЛЭХ ЕРӨНХИЙ ЗАРЧИМ',
          style: 'sectionHeader'
        },
        {
          ol: [
            'Энэ нь тухайн хичээлээр оюутны эзэмшсэн суралцахуйн үр дүнгүүд буюу мэдлэг, чадвар, хандлага нэг бүрийг үнэлж дүгнэх зорилготой тайлан байна.',
            'Салбар, тэнхим бүр тухайн улиралд заагдсан бүх хичээлээр “Хичээлийн суралцахуйн үр дүнгийн үнэлгээний тайлан(Assessment Report of Course Learning Outcomes: AR-CLOs)-г заавал гаргана. Өөрөө хэлбэл хичээл заасан багш бүр хичээлийн материал бүрдүүлэлтийн нэг хэсэг болгож энэхүү тайланг заавал гаргана.',
            {
              text: 'Хэрэв тухайн хичээлийг хэд хэдэн багш хамтран заасан бол багш бүр өөрийн заасан хэсгийн суралцахуйн үр дүнгийн үнэлгээг гаргаж дараа нь нэгдсэн тайлан гаргана.',
            },
            'AR-CLOs нь шууд (Сорил, бие даалт, лабораторийн ажлын гүйцэтгэл, төслийн тайлан, улирлын шалгалт гэх мэт багшийн 70 ба 30 онооны үнэлгээ) ба шууд бус үнэлгээ (Оюутнаас хичээлийн суралцахуйн үр дүнгүүдийг хэр түвшинд эзэмшсэн болон бусад хичээлтэй холбоотой санал асуулга)-ний хэсэгтэй байна.',
            'Багш бүр CLOs-ийн үнэлгээнд ашигласан оюутны гүйцэтгэсэн ажлын материалуудаас дээжлэн сайн, дунд, тааруу (бие даалт, лаборатори, төслийн тайлан, сорил, улирлын шалгалтын тестийн үр дүн, төгсөлтийн дипломын төслийн тайлан гэх мэт) материал тус бүрээс нотлох баримт байдлаар хадгалах ёстой.',
            {
              text: 'Үнэлгээ нь хичээлийн тухайн үр дүнгийн хувьд С ба түүнээс дээш үнэлгээ бүхий оюутны эзлэх хувиар тодорхойлогдоно. Өөрөөр хэлбэл тухайн хичээлд 2 ба түүнээс дээш голч дүнтэй суралцсан суралцагчдын эзлэх хувиар тодорхойлогдоно.',
              margin: [0, 5, 0, 0] as [number, number, number, number]
            },
            {
              text: ['Шууд үнэлгээний үр дүн зорилтот түвшинг хангаж байгаа эсэхийг дараах байдлаар  тодорхойлно.\n' +
                'Хичээлийн тухайн үр дүнгийн гүйцэтгэлд А, В, С+ ба С үнэлгээ авсан оюутны эзлэх хувь дараах зорилтот түвшинг хангаж байгаа эсэхэд үнэлэлт дүгнэлт өгнө. Үүнд:\n',
              { text: '➢ 91-100%:              ', bold: true }, 'Шаардлага бүрэн хангаж;\n',
              { text: '➢ 81-90%:                ', bold: true }, 'Шаардлага хангасан, зарим талаар сайжруулалт хийж болно;\n',
              { text: '➢ 70-80%:                ', bold: true }, 'Шаардлага хангасан, гэхдээ сайжруулалт хийх хэрэгтэй;\n',
              { text: '➢ 70%-аас доош:   ', bold: true }, 'Шаардлага хангаагүй, заавал сайжруулалт хийх шаардлагатай.'
              ],
              margin: [0, 5, 0, 5] as [number, number, number, number]
            },
            {
              text: ['Шууд бус үнэлгээний үр дүн зорилтот түвшинг хангаж байгаа эсэхийг дараах байдлаар тодорхойлно.\n' +
                'Хичээлийн санал асуулга дахь CLO бүрийн гүйцэтгэлийг 1-5 түвшингээр үнэлэх ба 4 ба 5 оноо бүхий хариултын тоо 70%-аас доошгүй байна. Үр дүнг дараах байдлаар ангилан үнэлэлт, дүгнэлт гаргана.Үүнд:\n',
              { text: '➢ 91-100%:              ', bold: true }, 'Шаардлага бүрэн хангаж;\n',
              { text: '➢ 81-90%:                ', bold: true }, 'Шаардлага хангасан, зарим талаар сайжруулалт\n',
              { text: '➢ 70-80%:                ', bold: true }, 'Шаардлага хангасан, гэхдээ сайжруулалт хийх хэрэгтэй;\n',
              { text: '➢ 70%-аас доош:   ', bold: true }, 'Шаардлага хангаагүй, заавал сайжруулалт хийх шаардлагатай.'
              ],
              margin: [0, 5, 0, 0] as [number, number, number, number]
            },
            {
              text: ['Хичээлийн санал асуулгын бусад асуултуудыг мөн 1-5 түвшингээр үнэлэх ба 3-5 оноо бүхий хариултын тоо 70%-аас доошгүй байна. Үр дүнг дараах байдлаар ангилан үнэлэлт, дүгнэлт гаргана.Үүнд:\n',
                { text: '➢ 91-100%:              ', bold: true }, 'Шаардлага бүрэн хангаж;\n',
                { text: '➢ 81-90%:                ', bold: true }, 'Шаардлага хангасан, зарим талаар сайжруулалт\n',
                { text: '➢ 70-80%:                ', bold: true }, 'Шаардлага хангасан, гэхдээ сайжруулалт хийх хэрэгтэй;\n',
                { text: '➢ 70%-аас доош:   ', bold: true }, 'Шаардлага хангаагүй, заавал сайжруулалт хийх шаардлагатай.'
              ],
              margin: [0, 5, 0, 0] as [number, number, number, number]
            },
            {
              text: 'Шууд ба шууд бус үнэлгээний нэгдсэн шалгуурыг дараах хүснэгтээс харж болно.',
              margin: [0, 5, 0, 0] as [number, number, number, number]
            },
          ],
          style: 'body',
          type: 'lower-alpha' as const, // Automatically renders a), b), c)...
          margin: [30, 0, 30, 0] as [number, number, number, number]
        },
        { text: '', pageBreak: 'before' as const },
        {
          table: {
            // headerRows: 1,
            widths: [
              '25%',
              '25%',
              '25%',
              '25%',
            ],
            body: unifiedCriteTable,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          margin: [0, 100, 0, 0] as [number, number, number, number],
        },
        { text: 'Тайлбар: A: Маш сайн; B: Сайн; С: Дунд; D: Хангалтгүй', style: 'bodyLeft' },
        { text: '2.	ХИЧЭЭЛИЙН ЕРӨНХИЙ МЭДЭЭЛЭЛ', style: 'titleLeft', margin: [0, 20, 0, 0] as [number, number, number, number], },
        { text: 'Хүснэгт 2. Хичээлийн мэдээлэл', style: 'bodyRight' },
        {
          table: {
            // headerRows: 1,
            widths: [
              '50%',
              '50%',
            ],
            body: lessonDetailTable,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        { text: '3.	ХИЧЭЭЛЭЭР ЭЗЭМШИХ СУРАЛЦАХУЙН ҮР ДҮНГҮҮД', style: 'titleLeft', margin: [0, 20, 0, 10] as [number, number, number, number], },
        { text: 'Хүснэгт 3. Хичээлийн суралцахуйн үр дүн', style: 'bodyRight' },
        {
          table: {
            // headerRows: 1,
            widths: [
              '10%',
              '90%',
            ],
            body: cloTable,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        {
          text: '', pageBreak: 'before' as const,
          pageOrientation: 'landscape' as const
        },
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
          margin: [20, 0, 20, 5] as [number, number, number, number],
          pageBreak: 'before' as any,
          pageOrientation: 'portrait' as const
        },
        {
          text: '5.1.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ  ',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number]
        },
        {
          text: '<Хүснэгт 4-д үзүүлсэн төлөвлөлтөд үндэслэн хичээлийн тухайн суралцахуйн үр дүн (CLOs)-нд харгалзах үнэлгээний аргыг (1-15 хүртэлх) түүвэрлэн, харгалзах гүйцэтгэлийн оноог оюутан бүрээр гаргана. Жишээ загварыг хүснэгт 5-аас 6-д үзүүлэв.>',
          margin: [20, 20, 20, 5] as [number, number, number, number],
          style: 'bodyRed'
        },
        {
          text: '5.1.1.	ТУХАЙН CLO-Д ХАРГАЛЗАХ ОЮУТНЫ ГҮЙЦЭТГЭЛИЙН ҮНЭЛГЭЭ',
          fontSize: 12,
          bold: true,
          margin: [40, 0, 20, 5] as [number, number, number, number]
        },
        ...contentAssessmentArray,
      ],
      styles: {

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

        header: { fontSize: 14, bold: true },
        // tableGreen: { fontSize: 10, fontStyle: 'Arial', color: 'black', fillColor: '#D9EADA' },
        tableCloHeader: {
          fontSize: 4,
          fontStyle: 'Arial',
          color: 'black',
          padding: [0, 10, 0, 0] as [number, number, number, number],
        },
        tableHeader: { fontSize: 10, fontStyle: 'Times New Roman', bold: true },
        body: { fontSize: 10, bold: false, fontStyle: 'Arial' },
        bodyCenter: { fontSize: 10, bold: false, fontStyle: 'Arial', alignment: 'center' as const },
        title: { fontSize: 11, bold: true, fontStyle: 'Times New Roman', alignment: 'center' as const },
        leftMargin: { fontSize: 10, bold: false, alignment: 'left' as const, margin: [50, 10, 0, 0] as [number, number, number, number], },
        contents: { fontSize: 10, bold: true },
        bodyLeft: { fontSize: 11, alignment: 'left' as const, bold: true },
        bodyLeftInBold: { fontSize: 11, alignment: 'left' as const, bold: true },
        titleLeft: { fontSize: 14, alignment: 'left' as const, bold: true },
        bodyRight: { fontSize: 10, alignment: 'right' as const },
        bodyRightInBold: { fontSize: 13, alignment: 'right' as const, bold: true },
        footerCenter: { fontSize: 12, alignment: 'center' as const },
        mainTitleStyle: { fontSize: 14, bold: true, alignment: 'center' as const, margin: [0, 0, 0, 30] as [number, number, number, number], },
        image: { alignment: 'center' as const, margin: [0, 70, 0, 100] as [number, number, number, number], },
        bodyRed: {
          fontSize: 10,
          color: 'red',
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        tableGreenAssessment: { fontSize: 10, fontStyle: 'Arial', color: 'black', fillColor: '#D9EADA'},
        bodyAssessment: { fontSize: 10, bold: false, fontStyle: 'Arial' },
        bodyCenterAssessment: { fontSize: 10, bold: false, fontStyle: 'Arial', alignment: 'center' as const },
        titleAssessment: { fontSize: 11, bold: true, fontStyle: 'Times New Roman', alignment: 'center' as const},
        footerCenterAssessment: { fontSize: 12, alignment: 'center' as const},
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
