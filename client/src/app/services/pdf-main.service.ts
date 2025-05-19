import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { Content } from 'pdfmake/interfaces';
export const checked =
  'data:image/png;base64,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';
export const unChecked =
  'data:image/png;base64,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';

@Injectable({
  providedIn: 'root',
})
export class PdfMainService {
  private getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    return fetch(imageUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  }

  async generatePdfAll(daty: any) {
    const contentArray: any[] = [];

    let lessonLevel = '';
    let mainInfo = daty[4];
    let lessStudent = daty[5];
    let originalCloList = daty[6];
    let direcIndirecAssesmentList = daty[7];
    let feedBackTastList = daty[8];
    let feedBackList = daty[9];
    let season = daty[10];

    if (mainInfo.lessonLevel === 'MAGISTER') {
      lessonLevel = 'Магистр';
    } else if (mainInfo.lessonLevel === 'BACHELOR') {
      lessonLevel = 'Бакалавр';
    } else if (mainInfo.lessonLevel === 'DOCTOR') {
      lessonLevel = 'Доктор';
    } else {
      // sonar aldaa..
    }
    let lessonType = '';
    if (mainInfo.lessonType === 'REQ') {
      lessonType = 'Заавал';
    } else if (mainInfo.lessonType === 'CHO') {
      lessonType = 'Сонгон';
    } else {
      // sonar aldaa..
    }
    let recommendedSemester = '';

    if (mainInfo.recommendedSemester == 'any') {
      mainInfo.recommendedSemester = season.itemValue;
    }
    if (mainInfo.recommendedSemester === 'autumn') {
      recommendedSemester = 'Намар';
    } else if (mainInfo.recommendedSemester === 'spring') {
      recommendedSemester = 'Хавар';
    } else if (mainInfo.recommendedSemester === 'winter') {
      recommendedSemester = 'Өвлийн';
    } else {
      // sonar aldaa..
    }
    let recommendedSemesterIng = '';
    if (mainInfo.recommendedSemester === 'autumn') {
      recommendedSemesterIng = 'Намрын';
    } else if (mainInfo.recommendedSemester === 'spring') {
      recommendedSemesterIng = 'Хаврын';
    } else if (mainInfo.recommendedSemester === 'any') {
      recommendedSemesterIng = 'Дурын';
    } else if (mainInfo.recommendedSemester === 'winter') {
      recommendedSemesterIng = 'Өвлийн';
    } else {
      // sonar aldaa..
    }
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

      const dynamicSubHeaders = assessPlan.map(
        (plan: { subMethodName: any }) => ({
          text: plan.subMethodName,
          alignment: 'center',
          style: 'tableGreen',
        })
      );

      const dynamicOneColumn = [
        {
          text: data.title,
          alignment: 'center',
          style: 'tableGreen',
          colSpan: assessPlanCount,
        },
        ...Array(assessPlanCount - 1).fill({}),
      ];

      const mainPointHeader = assessPlan.map((plan: { point: any }) => ({
        text: plan.point,
        alignment: 'center',
        style: 'bodyCenter',
      }));

      const mainPoint = content.map((student: any, index: number) => {
        const row = [
          { text: index + 1, alignment: 'center', style: 'bodyCenter' },
          {
            text: student.studentName,
            alignment: 'center',
            style: 'bodyCenter',
          },
          ...student.points.map((p: { point: any }) => ({
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
          {
            text: 'Оюутны нэр/\nүнэлгээний аргууд',
            alignment: 'center',
            style: 'tableGreen',
          },
          ...dynamicSubHeaders,
          { text: 'Нийт оноо', alignment: 'center', style: 'tableGreen' },
          {
            text: '100%-д шилжүүлсэн оноо',
            alignment: 'center',
            style: 'tableGreen',
          },
          { text: 'Үсгэн үнэлгээ', alignment: 'center', style: 'tableGreen' },
        ],
        dynamicOneColumn,
        [
          {
            text: 'Авбал зохих оноо',
            colSpan: 2,
            alignment: 'center',
            style: 'title',
          },
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
        {
          text: `Хүснэгт ${dataIndex + 1}. ${data.title}`,
          style: 'footerCenter',
        },
        {
          table: {
            headerRows: 0,
            widths,
            body: tableBody,
            dontBreakRows: true,
          },
        },
        {
          text: `Боловсруулсан багш: ${data.teacherName}`,
          style: 'footerCenter',
        }
      );
    });

    let headerRowData: any = {};
    let enterRowData: any = {};
    let indirectAssesment: any = {};

    if (daty.length >= 2) {
      headerRowData = daty[0];
      enterRowData = daty[1];
      indirectAssesment = daty[3];
    }
    const progressPontCount = enterRowData[0].procPoints?.length || 0;
    const examPointCount = enterRowData[0].examPoints?.length || 0;

    const procPointsLength = progressPontCount + 3 + examPointCount;

    const lengthValue = procPointsLength; // энэ бол нийт хэдэн багана болж хуваагдхын олох мөн default 3 багана нэмж өгж байгаа

    const percent = 89 / lengthValue; // багана болж хуваагдах хэмжээ

    const widths: string[] = ['3%', '8%'];

    for (let i = 0; i < procPointsLength; i++) {
      widths.push(`${percent.toFixed(2)}%`);
    }
    const defaultHeaders = [
      { text: 'Д/Д', rowSpan: 4, alignment: 'center', style: 'tableHeader' },
      {
        text: 'Хичээлийн суралцахуйн\nүр дүн (CLOs)\n/Үнэлгээний аргууд',
        rowSpan: 4,
        alignment: 'center',
        style: 'tableHeader',
      },
    ];

    const dynamicHeaders = headerRowData.plans.flatMap(
      (plan: { subMethods: any[]; methodName: string; methodType: string }) => {
        const subMethodCount = plan.subMethods.length;
        const headers = [];

        if (plan.methodType === 'EXAM') {
          headers.push({
            text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nявцын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо',
            alignment: 'center',
            style: 'tableGreen',
            rowSpan: 4,
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
      }
    );

    const dynamicSubHeaders = headerRowData.plans.flatMap(
      (plan: { subMethods: any[]; methodName: string; methodType: string }) => {
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
      }
    );
    const dynamicTopHeaders = [
      {},
      {},
      {
        text: 'Явцын 70 онооны задаргаа /хичээлийн хэлбэрээс хамаарч өөрчлөгдөнө/',
        colSpan: progressPontCount,
        alignment: 'center',
        style: 'tableYellow',
      },
      ...Array(progressPontCount - 1).fill({}), // colSpan тул үлдсэн багануудыг хоосон болгоно
      {},
      {
        text: 'Шалгалтын 30 онооны задаргаа',
        colSpan: examPointCount,
        alignment: 'center',
        style: 'tableYellow',
      },
      ...Array(examPointCount - 1).fill({}), // colSpan тул үлдсэн багануудыг хоосон болгоно
      {},
      {},
    ];

    const dynamicSubPoints = headerRowData.plans.flatMap(
      (plan: { subMethods: any[]; methodName: string; methodType: string }) => {
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
      }
    );

    const cloLecColumn = enterRowData.flatMap((clo: any, index: any) => {
      const headers = [];
      const headersData = [];

      // Extract points
      let procAllPoint = 0;
      clo.procPoints.map((procPoints: any) => {
        procAllPoint = procAllPoint + procPoints.point;
      });
      let examAllPoint = 0;
      clo.examPoints.map((examPoints: any) => {
        examAllPoint = examAllPoint + examPoints.point;
      });
      if (clo.cloType !== 'CLAB') {
        // Sum of all points
        const allPoint = procAllPoint + examAllPoint;
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
        procAllPoint = procAllPoint + procPoints.point;
      });
      let examAllPoint = 0;
      clo.examPoints.map((examPoints: any) => {
        examAllPoint = examAllPoint + examPoints.point;
      });

      if (clo.cloType === 'CLAB') {
        // Sum of all points
        const allPoint = procAllPoint + examAllPoint;
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
    const cloAssesment = [
      // Header row
      [
        {
          text: 'Д/Д',
          rowSpan: 4,
          alignment: 'center',
          style: 'tableCloHeader',
        },
        {
          text: 'Хичээлийн суралцахуйн\nүр дүн (CLOs)\n/Үнэлгээний аргууд',
          rowSpan: 4,
          alignment: 'center',
          style: 'tableCloHeader',
        },
        ...dynamicHeaders,
        // { text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nявцын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо', rowSpan: 4, alignment: 'center', style: 'tableYellow' },
        {
          text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nшалгалтын\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо',
          rowSpan: 4,
          alignment: 'center',
          style: 'tableYellow',
        },
        {
          text: 'Тухайн\nсуралцахуйн\nүр дүнд\nхаргалзах\nүнэлгээнээс\nавбал зохих\nнийлбэр оноо\n/явц+шалгалт/',
          rowSpan: 4,
          alignment: 'center',
          style: 'tableBlue',
        },
      ],
      [{}, {}, ...dynamicSubHeaders, {}, {}],
      [...dynamicTopHeaders],
      [{}, {}, ...dynamicSubPoints, {}, {}],
      [
        {
          text: 'Лекц семинарын хичээлээр эзэмшсэн суралцхуйн үр дүнгүүд',
          colSpan: procPointsLength + 2,
          alignment: 'center',
          style: 'tableGoldenYellow',
        },
        ...Array(procPointsLength + 2 - 1).fill({}),
      ],
      ...cloLecColumn.map((row: any, index: any) => {
        return Array.isArray(row) ? row : [];
        // Ensure row.stack is an array or return an empty array if it's not
      }),
      [
        {
          text: 'Лабораторийн хичээлээр эзэмшсэн суралцхуйн үр дүнгүүд',
          colSpan: procPointsLength + 2,
          alignment: 'center',
          style: 'tableGoldenYellow',
        },
        ...Array(procPointsLength + 2 - 1).fill({}),
      ],
      ...cloLabColumn.map((row: any, index: any) => {
        // Ensure row.stack is an array or return an empty array if it's not
        return Array.isArray(row) ? row : [];
      }),
    ];

    const base64Image = await this.getBase64ImageFromUrl('assets/img/logo.png');

    const liveDate = new Date();
    const formattedDate = liveDate.toISOString().split('T')[0];

    const lessonDetailTable = [
      [
        {
          text: 'Хичээлийн нэр',
          alignment: 'left',
          style: 'body',
        },
        {
          text: daty[4].lessonName,
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
          text: daty[4].lessonCode,
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
          text: daty[4].lessonCredit,
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
          text: lessonType,
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
          text: mainInfo.departmentName,
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
          text: daty[4].teacher.name,
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
          text: recommendedSemester,
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
          text: lessStudent.length,
          alignment: 'left',
          style: 'body',
        },
      ],
    ];
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
    ];
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
      let contentAssessment: any[] = [];
      if (data.assessPlan.length > 0) {
        assessPlanAssessment = data.assessPlan;
        contentAssessment = data.content;
      } else {
        return;
      }
      const assessPlanAssessmentCount = assessPlanAssessment.length + 5;
      const percentAssessment = 80 / (assessPlanAssessment.length + 3);

      const widthsAssessment: string[] = ['5%', '15%'];
      for (let i = 0; i < assessPlanAssessment.length + 3; i++) {
        widthsAssessment.push(`${percentAssessment.toFixed(2)}%`);
      }

      const dynamicSubHeadersAssessment = assessPlanAssessment.map(
        (plan: { subMethodName: any }) => ({
          text: plan.subMethodName,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })
      );

      const dynamicOneColumnAssessment = [
        {
          text: data.title,
          alignment: 'center',
          style: 'tableGreenAssessment',
          colSpan: assessPlanAssessmentCount,
        },
        ...Array(assessPlanAssessmentCount - 1).fill({}),
      ];

      const mainPointHeaderAssessment = assessPlanAssessment.map(
        (plan: { point: any }) => ({
          text: plan.point,
          alignment: 'center',
          style: 'bodyCenterFoAssessment',
        })
      );

      const mainPointAssessment = contentAssessment.map(
        (student: any, index: number) => {
          const row = [
            {
              text: index + 1,
              alignment: 'center',
              style: 'bodyCenterAssessment',
            },
            {
              text: student.studentName,
              alignment: 'center',
              style: 'bodyCenterAssessment',
            },
            ...student.points.map((p: { point: any }) => ({
              text: isFinite(p.point) ? Number(p.point).toFixed(2) : p.point,
              alignment: 'center',
              style: 'bodyAssessment',
            })),
            {
              text: isFinite(student.totalPoint)
                ? Number(student.totalPoint).toFixed(2)
                : student.totalPoint,
              alignment: 'center',
              style: 'bodyAssessment',
            },
            {
              text: isFinite(student.percentage)
                ? Number(student.percentage).toFixed(2)
                : student.percentage,
              alignment: 'center',
              style: 'bodyAssessment',
            },
            {
              text: student.letterGrade,
              alignment: 'center',
              style: 'bodyAssessment',
            },
          ];
          return row;
        }
      );

      const tableBodyAssessment = [
        [
          { text: 'д/д', alignment: 'center', style: 'tableGreenAssessment' },
          {
            text: 'Оюутны нэр/\nүнэлгээний аргууд',
            alignment: 'center',
            style: 'tableGreenAssessment',
          },
          ...dynamicSubHeadersAssessment,
          {
            text: 'Нийт оноо',
            alignment: 'center',
            style: 'tableGreenAssessment',
          },
          {
            text: '100%-д шилжүүлсэн оноо',
            alignment: 'center',
            style: 'tableGreenAssessment',
          },
          {
            text: 'Үсгэн үнэлгээ',
            alignment: 'center',
            style: 'tableGreenAssessment',
          },
        ],
        dynamicOneColumnAssessment,
        [
          {
            text: 'Авбал зохих оноо',
            colSpan: 2,
            alignment: 'center',
            style: 'titleAssessment',
          },
          {},
          ...mainPointHeaderAssessment,
          {
            text: data.totalPoint,
            alignment: 'center',
            style: 'bodyCenterFoAssessment',
          },
          {
            text: '100%',
            alignment: 'center',
            style: 'bodyCenterFoAssessment',
          },
          { text: 'A', alignment: 'center', style: 'bodyCenterFoAssessment' },
        ],
        ...mainPointAssessment,
      ];

      // Append to contentAssessment
      contentAssessmentArray.push(
        {
          text: `Хүснэгт ${dataIndex + 5}. ${data.title}`,
          style: 'bodyRightInBold',
          margin: [20, 20, 20, 5] as [number, number, number, number],
        },
        {
          table: {
            headerRows: 0, // Don't repeat headers on new pages
            widths: widthsAssessment,
            body: tableBodyAssessment,
            dontBreakRows: true,
            pageBreak: 'before' as any,
            pageOrientation: 'landscape' as const,
          },
        },
        { text: '', pageBreak: 'before' as const }
      );
    });

    const overallWidths: string[] = ['5%', '10%', '10%'];
    const cloListData: any[] = [];
    const cloData = daty[2];
    let countOverallNotZero = 0;
    let overallStudentCount = 0;
    cloData.map(
      (
        row: {
          content: any;
          assessPlan: any;
          id: any;
          title: any;
          cloName: any;
        },
        index: any
      ) => {
        overallStudentCount = row.content.length;
        if (row.assessPlan.length > 0) {
          index = index + 1;
          countOverallNotZero = countOverallNotZero + 1;
          const data = {
            cloName: 'CLO ' + index,
            name: row.title,
            code: row.id,
            order: index,
          };
          cloListData.push(data);
        }
      }
    );

    const overallPercent = 75 / countOverallNotZero;

    for (let i = 0; i < procPointsLength; i++) {
      overallWidths.push(`${overallPercent.toFixed(2)}%`);
    }

    const overallCloList = cloListData.map((plan: { cloName: any }) => ({
      text: plan.cloName,
      alignment: 'center',
      style: 'tableGreenBoldAssessment',
    }));
    // 1. Нийт оноог бодох хэсэг
    const colpoint = enterRowData.map((a: any) => {
      const examTotal = a.examPoints.reduce(
        (sum: number, e: any) => sum + e.point,
        0
      );
      const procTotal = a.procPoints.reduce(
        (sum: number, e: any) => sum + e.point,
        0
      );
      return examTotal + procTotal;
    });

    // 2. CLO бүрт холбогдсон дүнг тохируулах (энэ хэсэгт зорилго тодорхой биш тул өөрчлөлт хийв)
    const overallCloPoint = cloListData.map(
      (plan: { cloName: any }, index: number) => ({
        text: colpoint[index] ?? 0, // тухайн index-д харгалзах оноо
        alignment: 'center',
        style: 'tableHeader',
      })
    );

    const overallAllStudent = cloListData.map(
      (plan: { cloName: any }, index: number) => ({
        text: overallStudentCount, // тухайн index-д харгалзах оноо
        alignment: 'center',
        style: 'tableHeader',
      })
    );

    const studentsMap: { [studentCode: string]: any[] } = {};

    cloData.forEach((clo: any, cloIndex: number) => {
      clo.content.forEach((e: any, contentIndex: number) => {
        if (e.percentage >= 0) {
          const studentData = {
            studentName: e.studentName,
            studentCode: e.studentCode,
            studentId: e.studentId,
            letterGrade: e.letterGrade,
            percentage: e.percentage,
            totalPoint: e.totalPoint,
          };

          if (!studentsMap[e.studentCode]) {
            studentsMap[e.studentCode] = [];
          }

          studentsMap[e.studentCode].push(studentData);
        }
      });
    });

    // Хэрвээ array хэлбэрээр хэрэгтэй бол:
    const studentsCloEvaluation = Object.values(studentsMap);

    const overallCOverStudent = cloData
      .map((data: any) => {
        if (data.assessPlan.length > 0) {
          let aLetterGrade = 0;
          let aMinusLetterGrade = 0;
          let bPlusLetterGrade = 0;
          let bLetterGrade = 0;
          let bMinusLetterGrade = 0;
          let cPlusLetterGrade = 0;
          let cLetterGrade = 0;
          let badLetterGrade = 0;
          let cOverCounts = 0;

          data.content.forEach((e: any) => {
            if (e.percentage >= 0) {
              cOverCounts++;
              switch (e.letterGrade) {
                case 'A':
                  aLetterGrade++;
                  break;
                case 'A-':
                  aMinusLetterGrade++;
                  break;
                case 'B+':
                  bPlusLetterGrade++;
                  break;
                case 'B':
                  bLetterGrade++;
                  break;
                case 'B-':
                  bMinusLetterGrade++;
                  break;
                case 'C+':
                  cPlusLetterGrade++;
                  break;
                case 'C':
                  cLetterGrade++;
                  break;
                default:
                  badLetterGrade++;
                  cOverCounts--; // invalid grade
              }
            }
          });

          const cOverPercents =
            ((data.content.length - badLetterGrade) / data.content.length) *
            100;
          return {
            aLetterGrade,
            aMinusLetterGrade,
            bPlusLetterGrade,
            bLetterGrade,
            bMinusLetterGrade,
            cPlusLetterGrade,
            cLetterGrade,
            cOverCounts,
            cOverPercents: cOverPercents.toFixed(1) + '%',
          };
        } else {
          return undefined;
        }
      })
      .filter((item: undefined) => item !== undefined); // undefined-үүдийг хаяна;

    console.log(overallCOverStudent);
    const overallCloMain = studentsCloEvaluation.map(
      (data: any, index: number) => {
        const row = [
          {
            text: index + 1,
            alignment: 'center',
            style: 'bodyCenterAssessment',
          },
          {
            text: data[0].studentName,
            colSpan: 2,
            alignment: 'center',
            style: 'bodyCenterAssessment',
          },
          {},
          ...data.map((p: { letterGrade: any }) => ({
            text: p.letterGrade,
            alignment: 'center',
            style: 'bodyAssessment',
          })),
        ];
        return row;
      }
    );
    const overallAssesmentInd = [
      [
        { text: 'д/д', alignment: 'center', style: 'tableGreenBoldAssessment' },
        {
          text: 'Оюутны нэрс/ CLOs',
          colSpan: 2,
          alignment: 'center',
          style: 'tableGreenBoldAssessment',
        },
        {},
        ...overallCloList,
      ],
      [
        {
          text: 'Авбал зохих нийт оноо',
          colSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        ...overallCloPoint,
      ],
      ...overallCloMain,
      [
        {
          text: 'Үнэлгээний нэгтгэл:',
          colSpan: countOverallNotZero + 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        ...Array(countOverallNotZero + 3 - 1).fill({}),
      ],
      [
        {
          text: 'Нийт үнэлэгдсэн оюутны тоо',
          colSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        ...overallAllStudent,
      ],
      [
        {
          text: 'С  ба түүнээс дээш үнэлгээтэй оюутны тоо',
          colSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        ...overallCOverStudent.map((e: any) => ({
          text: e.cOverCounts,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        {
          text: 'Үүнээс:',
          colSpan: 2,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        { text: 'A', alignment: 'center', style: 'tableHeader' },
        ...overallCOverStudent.map((e: any) => ({
          text: e.aLetterGrade,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        { text: '', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'A-', alignment: 'center', style: 'tableHeader' },
        ...overallCOverStudent.map((e: any) => ({
          text: e.aMinusLetterGrade,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        { text: '', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'B+', alignment: 'center', style: 'tableHeader' },
        ...overallCOverStudent.map((e: any) => ({
          text: e.bPlusLetterGrade,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        { text: '', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'B', alignment: 'center', style: 'tableHeader' },
        ...overallCOverStudent.map((e: any) => ({
          text: e.bLetterGrade,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        { text: '', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'B-', alignment: 'center', style: 'tableHeader' },
        ...overallCOverStudent.map((e: any) => ({
          text: e.bMinusLetterGrade,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        { text: '', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'C+', alignment: 'center', style: 'tableHeader' },
        ...overallCOverStudent.map((e: any) => ({
          text: e.cPlusLetterGrade,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        { text: '', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'C', alignment: 'center', style: 'tableHeader' },
        ...overallCOverStudent.map((e: any) => ({
          text: e.cLetterGrade,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        {
          text: 'С  ба түүнээс дээш үнэлгээтэй\nоюутны эзлэх хувь',
          colSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        ...overallCOverStudent.map((e: any) => ({
          text: e.cOverPercents,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
    ];

    function aggregateCloAssessment(indirectAssesment: any[]) {
      // CLO үнэлгээ хадгалах Map
      const cloStatsMap = new Map<
        number,
        {
          excellent: number;
          good: number;
          average: number;
          poor: number;
          veryPoor: number;
          total: number;
        }
      >();

      indirectAssesment.forEach((cla: any) => {
        cla.groupList.forEach((clo: any, index: number) => {
          if (!cloStatsMap.has(index)) {
            cloStatsMap.set(index, {
              excellent: 0,
              good: 0,
              average: 0,
              poor: 0,
              veryPoor: 0,
              total: 0,
            });
          }

          const stats = cloStatsMap.get(index)!;

          clo.questionList.forEach((q: any) => {
            if (q.questionType === 'RATE') {
              stats.total++;

              switch (q.answerValue) {
                case '5':
                  stats.excellent++;
                  break;
                case '4':
                  stats.good++;
                  break;
                case '3':
                  stats.average++;
                  break;
                case '2':
                  stats.poor++;
                  break;
                case '1':
                  stats.veryPoor++;
                  break;
              }
            }
          });
        });
      });

      // CLO aggregated rows үүсгэх
      const rows: any[] = [];

      cloStatsMap.forEach((stats, index) => {
        const total45 = stats.excellent + stats.good;
        const percent45 =
          stats.total > 0 ? ((total45 / stats.total) * 100).toFixed(0) : '0';

        const countRow = [
          { text: 'CLO ' + (index + 1), rowSpan: 2, alignment: 'center' },
          { text: 'Хариултын тоо', alignment: 'center' },
          { text: stats.excellent, alignment: 'center' },
          { text: stats.good, alignment: 'center' },
          { text: stats.average, alignment: 'center' },
          { text: stats.poor, alignment: 'center' },
          { text: stats.veryPoor, alignment: 'center' },
          { text: stats.total, alignment: 'center' },
          { text: total45, alignment: 'center' },
        ];

        const percentRow = [
          {}, // for rowSpan
          { text: 'Эзлэх хувь(%)', alignment: 'center' },
          {
            text: stats.total
              ? ((stats.excellent / stats.total) * 100).toFixed(0)
              : '0',
            alignment: 'center',
          },
          {
            text: stats.total
              ? ((stats.good / stats.total) * 100).toFixed(0)
              : '0',
            alignment: 'center',
          },
          {
            text: stats.total
              ? ((stats.average / stats.total) * 100).toFixed(0)
              : '0',
            alignment: 'center',
          },
          {
            text: stats.total
              ? ((stats.poor / stats.total) * 100).toFixed(0)
              : '0',
            alignment: 'center',
          },
          {
            text: stats.total
              ? ((stats.veryPoor / stats.total) * 100).toFixed(0)
              : '0',
            alignment: 'center',
          },
          { text: '100', alignment: 'center' },
          { text: percent45, alignment: 'center' },
        ];

        rows.push(countRow, percentRow);
      });

      return rows;
    }
    const cloAssessmentLevel = aggregateCloAssessment(indirectAssesment);

    const indirectAssesmentTable = [
      [
        {
          text: '\nCLO/үнэлгээний\nтүвшин',
          colSpan: 2,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        { text: '\nМаш сайн\n(5)', alignment: 'center', style: 'tableHeader' },
        { text: '\nСайн\n(4)', alignment: 'center', style: 'tableHeader' },
        { text: '\nДунд\n(3)', alignment: 'center', style: 'tableHeader' },
        { text: '\nМуу\n(2)', alignment: 'center', style: 'tableHeader' },
        { text: '\nМаш муу\n(1)', alignment: 'center', style: 'tableHeader' },
        { text: '\nНийт\nхариулт', alignment: 'center', style: 'tableHeader' },
        {
          text: '4 ба 5 оноотой\nхариулт тоо,\nэзлэх хувь',
          alignment: 'center',
          style: 'tableHeader',
        },
      ],
      ...cloAssessmentLevel,
    ];

    const normalCloMain: any[] = [];
    let count = 1;

    const cloLabData: any[] = [];
    const cloLecData: any[] = [];
    const cloSemData: any[] = [];
    const cloOtherData: any[] = [];

    for (const item of originalCloList) {
      switch (item.type) {
        case 'CLAB':
          cloLabData.push(item);
          break;
        case 'ALEC':
          cloLecData.push(item);
          break;
        case 'BSEM':
          cloSemData.push(item);
          break;
        default:
          cloOtherData.push(item); // optionally collect others
      }
    }

    console.log('LAB:', cloLabData);
    console.log('LEC:', cloLecData);
    console.log('SEM:', cloSemData);
    console.log('OTHERS:', cloOtherData); // optional

    const processCloGroup = (cloList: any[], title: string) => {
      // Header
      normalCloMain.push([
        {
          text: title,
          colSpan: 2,
          alignment: 'left',
          style: 'headerRow',
          bold: true,
        },
        {},
      ]);

      // Мөрүүд
      cloList.forEach((data: any) => {
        if (data.cloName) {
          normalCloMain.push([
            { text: count, alignment: 'center', style: 'bodyAssessment' },
            { text: data.cloName, alignment: 'left', style: 'bodyAssessment' },
          ]);
          count++;
        }
      });
    };

    // 3. Хэсгүүдийг дарааллаар нь оруулна
    if (cloLecData.length > 0) {
      processCloGroup(
        cloLecData,
        'Оюутан лекцийн хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:'
      );
    }
    if (cloLabData.length > 0) {
      processCloGroup(
        cloLabData,
        'Оюутан лабораторийн хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:'
      );
    }
    if (cloSemData.length > 0) {
      processCloGroup(
        cloSemData,
        'Оюутан семинарын хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:'
      );
    }

    const cloTable = [...normalCloMain];

    const dricetIndirCount = cloListData.length;
    const dricetIndirAssess = 85 / dricetIndirCount; // багана болж хуваагдах хэмжээ

    const widthsDricetIndir: string[] = ['15%'];
    for (let i = 0; i < dricetIndirCount; i++) {
      widthsDricetIndir.push(`${dricetIndirAssess.toFixed(2)}%`);
    }
    const values = direcIndirecAssesmentList[0]?.values;
    const cells = Object.values(values);

    const values1 = direcIndirecAssesmentList[1]?.values;
    const cells1 = Object.values(values1);

    const values2 = direcIndirecAssesmentList[2]?.values;
    const cells2 = Object.values(values2);

    const values13 = direcIndirecAssesmentList[3]?.values;
    const cells13 = Object.values(values13);

    // const cells1 = Array.isArray(values)
    const direcIndirecAssesmentTable = [
      [
        { text: 'Үнэлгээ/CLOs', alignment: 'center', style: 'contents' },
        ...cloListData.map((e: any) => ({
          text: e.cloName,
          alignment: 'center',
          style: 'body',
        })),
      ],
      [
        {
          text: 'Шууд\nүнэлгээний\nдундаж хувь',
          alignment: 'center',
          style: 'body',
        },
        ...cells.map((e: any) => ({
          text: e,
          alignment: 'center',
          style: 'body',
        })),
      ],
      [
        {
          text: 'Шалгуур\nхангасан\nбайдал',
          alignment: 'center',
          style: 'contents',
        },
        ...cells1.map((e: any) => ({
          text: e,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
      [
        {
          text: 'Шууд бус\nүнэлгээний\nдундаж хувь',
          alignment: 'center',
          style: 'body',
        },
        ...cells2.map((e: any) => ({
          text: e,
          alignment: 'center',
          style: 'body',
        })),
      ],
      [
        {
          text: 'Шалгуур\nхангасан\nбайдал',
          alignment: 'center',
          style: 'contents',
        },
        ...cells13.map((e: any) => ({
          text: e,
          alignment: 'center',
          style: 'tableGreenAssessment',
        })),
      ],
    ];

    let reportList: any[] = [];
    indirectAssesment.map((res: any) => {
      let queistonList: any[] = [];
      const total = res.length;
      let excellent = 0;
      let good = 0;
      let average = 0;
      let thirdValue = 0;

      res.groupList.flatMap((clo: any, index: any) => {
        clo.questionList.forEach((e: any, indexX: number) => {
          let count = 0;
          let quistionData = {
            point: 0,
            name: '',
            total: 0,
            percent: 0,
            id: '',
          };
          if (e.questionType === 'RATE') {
            switch (e.answerValue) {
              case '5':
                excellent++;
                count++;
                break;
              case '4':
                good++;
                count++;
                break;
              case '3':
                average++;
                count++;
                break;
            }
            if (reportList.length > 0) {
              reportList[0].map((data: any, indexZ: number) => {
                if (thirdValue === indexZ) {
                  data.point = data.point + count;
                  data.total = data.total + 1;
                  data.percent = (data.point / data.total) * 100;
                }
              });
            } else {
              if (count > 0) {
                quistionData.percent = 100;
              }
              quistionData.point = count;
              quistionData.name = e.questionTitle;
              quistionData.id = e._id;
              quistionData.total = 1;
              queistonList.push(quistionData);
            }
          }
          thirdValue = thirdValue + 1;
        });
      });
      reportList.push(queistonList);
    });
    console.log(reportList[0]);

    const report = reportList[0].map((data: any, index: number) => {
      const row = [
        { text: data.name, alignment: 'left', style: 'bodyAssessment' },
        {
          text: isFinite(data.point)
            ? Number(data.point).toFixed(2)
            : data.point,
          alignment: 'center',
          style: 'bodyAssessment',
        },
        {
          text: isFinite(data.percent)
            ? Number(data.percent).toFixed(2)
            : data.percent,
          alignment: 'center',
          style: 'bodyAssessment',
        },
      ];
      return row;
    });
    console.log(report);

    const reportQuestionTable = [
      [
        {
          text: 'Санал асуулгад оролцсон оюутны тоо: 25\nХичээлийн ерөнхий үнэлгээ: 5=маш сайн;  4=сайн; 3=дунд; 2=муу; 1=маш муу',
          colSpan: 3,
          alignment: 'left',
          style: 'tableGreenBoldAssessment',
        },
        {},
        {},
      ],
      [
        {
          text: '\n\nАсуулгууд',
          alignment: 'center',
          style: 'tableGreenBoldAssessment',
        },
        {
          text: '3-5 оноо\nбүхий\nхариултын тоо',
          alignment: 'center',
          style: 'tableGreenAssessment',
        },
        {
          text: '3-5 оноо\nбүхий\nхариултын\nэзлэх хувь',
          alignment: 'center',
          style: 'tableGreenAssessment',
        },
      ],
      ...report,
    ];

    const grouped = feedBackTastList.reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    // 2. feedBackList-д хөрвүүлэх
    const feedBackLists = Object.entries(grouped).flatMap(
      ([category, items]) => {
        const castedItems = items as any[]; // 👈 тодорхой төрөл зааж өгнө

        const groupHeader = [
          { text: category, colSpan: 2, style: 'bodyBoldLeft' },
          {},
        ];

        const rows = castedItems.map((item: any) => [
          {
            image: item.selected ? checked : unChecked,
            width: 10,
            height: 10,
            alignment: 'center',
          },
          { text: `${item.index}. ${item.description}` },
        ]);

        return [groupHeader, ...rows];
      }
    );

    const feedBackTable = [
      [
        {
          text: 'Цонхон дээр\n2 удаа дарж\nсонгох',
          alignment: 'center',
          style: 'tableGreenBoldAssessment',
        },
        {
          text: '\nҮйл ажиллагааны чиглэлүүд',
          alignment: 'center',
          style: 'tableGreenBoldAssessment',
        },
      ],
      ...feedBackLists,
    ];

    const documentDefinition = {
      content: [
        {
          text: 'ШИНЖЛЭХ УХААН ТЕХНОЛОГИЙН ИХ СУРГУУЛЬ',
          style: 'mainTitleStyle',
        },
        {
          image: base64Image,
          width: 100,
          style: 'image',
        },
        {
          text: 'ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ҮНЭЛГЭЭНИЙ ТАЙЛАН',
          style: 'mainTitleStyle',
        },
        { text: 'Хичээлийн нэр: ' + mainInfo.lessonName, style: 'leftMargin' },
        {
          text: `Хичээлийн жил: ${mainInfo.schoolYear} оны ${recommendedSemesterIng} улирал`,
          style: 'leftMargin',
        },
        {
          table: {
            headerRows: 0,
            widths: ['33%', '34%', '33%'],
            body: tableBody,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          layout: 'noBorders',
          margin: [0, 100, 0, 0] as [number, number, number, number],
        },
        { text: '', pageBreak: 'before' as const },
        {
          text: 'Агуулга',
          style: 'headerTitle',
          margin: [0, 50, 0, 10] as [number, number, number, number],
        },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: '1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГ ҮНЭЛЭХ ЕРӨНХИЙ ЗАРЧИМ',
                  fontSize: 10,
                  bold: true,
                },
                { text: '3' },
              ],
              [
                {
                  text: '2. ХИЧЭЭЛИЙН ЕРӨНХИЙ МЭДЭЭЛЭЛ',
                  fontSize: 10,
                  bold: true,
                },
                { text: '4' },
              ],
              [
                {
                  text: '3. ХИЧЭЭЛЭЭР ЭЗЭМШИХ СУРАЛЦАХУЙН ҮР ДҮНГҮҮД',
                  fontSize: 10,
                  bold: true,
                },
                { text: '5' },
              ],
              [
                {
                  text: '4. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮДИЙН ҮНЭЛГЭЭНИЙ ТӨЛӨВЛӨЛТ',
                  fontSize: 10,
                  bold: true,
                },
                { text: '6' },
              ],
              [
                {
                  text: '5. ХИЧЭЭЛИЙН ШУУД БА ШУУД БУС ҮНЭЛГЭЭНИЙ ҮР ДҮН',
                  fontSize: 10,
                  bold: true,
                },
                { text: '7' },
              ],
              [
                {
                  text: '   5.1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ',
                  fontSize: 10,
                },
                { text: '6' },
              ],
              [
                {
                  text: '      5.1.1. ТУХАЙН CLO-Д ХАРГАЛЗАХ ОЮУТНЫ ГҮЙЦЭТГЭЛИЙН ҮНЭЛГЭЭ',
                  fontSize: 10,
                },
                { text: '6' },
              ],
              [
                {
                  text: '      5.1.2. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ҮНЭЛГЭЭНИЙ НЭГДСЭН ҮЗҮҮЛЭЛТ',
                  fontSize: 10,
                },
                { text: '7' },
              ],
              [
                {
                  text: '   5.2. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД БУС ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ',
                  fontSize: 10,
                },
                { text: '8' },
              ],
              [
                {
                  text: '      5.2.1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН САНАЛ АСУУЛГЫН ДҮН',
                  fontSize: 10,
                },
                { text: '8' },
              ],
              [
                {
                  text: '      5.2.2. CLOs-ИЙН САНАЛ АСУУЛГЫН ҮР ДҮНГИЙН ГРАФИК ҮЗҮҮЛЭЛТ',
                  fontSize: 10,
                },
                { text: '8' },
              ],
              [
                {
                  text: '   5.3. ШУУД БА ШУУД БУС ҮНЭЛГЭЭНИЙ НЭГДСЭН ҮЗҮҮЛЭЛТ',
                  fontSize: 10,
                },
                { text: '9' },
              ],
              [
                {
                  text: '6. САНАЛ АСУУЛГЫН БУСАД ҮР ДҮНГҮҮДЭД ХИЙСЭН ДҮН ШИНЖИЛГЭЭ',
                  fontSize: 10,
                  bold: true,
                },
                { text: '9' },
              ],
              [
                {
                  text: '7. СУРАЛЦАХУЙН ҮР ДҮНГИЙН ГҮЙЦЭТГЭЛИЙГ САЙЖРУУЛАХ ТӨЛӨВЛӨЛТ',
                  fontSize: 10,
                  bold: true,
                },
                { text: '9' },
              ],
              [
                {
                  text: '   7.1. ХИЧЭЭЛИЙН ОНЦЛОГ, ДАВУУ ТАЛУУД',
                  fontSize: 10,
                },
                { text: '9' },
              ],
              [
                { text: '   7.2. ХИЧЭЭЛИЙН СУЛ ТАЛУУД', fontSize: 10 },
                { text: '10' },
              ],
              [
                {
                  text: '   7.3. СУРАЛЦАХУЙН ҮР ДҮНГИЙН ГҮЙЦЭТГЭЛИЙГ ДЭЭШЛҮҮЛЭХ ЧИГЛЭЛЭЭР ХИЙХ АЖЛЫН ТӨЛӨВЛӨЛТ',
                  fontSize: 10,
                },
                { text: '10' },
              ],
              [
                {
                  text: '8. ХАВСРАЛТ 1. ХИЧЭЭЛИЙН САНАЛ АСУУЛГЫН ЗАГВАР',
                  fontSize: 10,
                  bold: true,
                },
                { text: '12' },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
        },
        { text: '', pageBreak: 'before' as const },
        {
          text: '1. ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГ ҮНЭЛЭХ ЕРӨНХИЙ ЗАРЧИМ',
          style: 'sectionHeader',
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
              margin: [0, 5, 0, 0] as [number, number, number, number],
            },
            {
              text: [
                'Шууд үнэлгээний үр дүн зорилтот түвшинг хангаж байгаа эсэхийг дараах байдлаар  тодорхойлно.\n' +
                  'Хичээлийн тухайн үр дүнгийн гүйцэтгэлд А, В, С+ ба С үнэлгээ авсан оюутны эзлэх хувь дараах зорилтот түвшинг хангаж байгаа эсэхэд үнэлэлт дүгнэлт өгнө. Үүнд:\n',
                { text: '➢ 91-100%:              ', bold: true },
                'Шаардлага бүрэн хангаж;\n',
                { text: '➢ 81-90%:                ', bold: true },
                'Шаардлага хангасан, зарим талаар сайжруулалт хийж болно;\n',
                { text: '➢ 70-80%:                ', bold: true },
                'Шаардлага хангасан, гэхдээ сайжруулалт хийх хэрэгтэй;\n',
                { text: '➢ 70%-аас доош:   ', bold: true },
                'Шаардлага хангаагүй, заавал сайжруулалт хийх шаардлагатай.',
              ],
              margin: [0, 5, 0, 5] as [number, number, number, number],
            },
            {
              text: [
                'Шууд бус үнэлгээний үр дүн зорилтот түвшинг хангаж байгаа эсэхийг дараах байдлаар тодорхойлно.\n' +
                  'Хичээлийн санал асуулга дахь CLO бүрийн гүйцэтгэлийг 1-5 түвшингээр үнэлэх ба 4 ба 5 оноо бүхий хариултын тоо 70%-аас доошгүй байна. Үр дүнг дараах байдлаар ангилан үнэлэлт, дүгнэлт гаргана.Үүнд:\n',
                { text: '➢ 91-100%:              ', bold: true },
                'Шаардлага бүрэн хангаж;\n',
                { text: '➢ 81-90%:                ', bold: true },
                'Шаардлага хангасан, зарим талаар сайжруулалт\n',
                { text: '➢ 70-80%:                ', bold: true },
                'Шаардлага хангасан, гэхдээ сайжруулалт хийх хэрэгтэй;\n',
                { text: '➢ 70%-аас доош:   ', bold: true },
                'Шаардлага хангаагүй, заавал сайжруулалт хийх шаардлагатай.',
              ],
              margin: [0, 5, 0, 0] as [number, number, number, number],
            },
            {
              text: [
                'Хичээлийн санал асуулгын бусад асуултуудыг мөн 1-5 түвшингээр үнэлэх ба 3-5 оноо бүхий хариултын тоо 70%-аас доошгүй байна. Үр дүнг дараах байдлаар ангилан үнэлэлт, дүгнэлт гаргана.Үүнд:\n',
                { text: '➢ 91-100%:              ', bold: true },
                'Шаардлага бүрэн хангаж;\n',
                { text: '➢ 81-90%:                ', bold: true },
                'Шаардлага хангасан, зарим талаар сайжруулалт\n',
                { text: '➢ 70-80%:                ', bold: true },
                'Шаардлага хангасан, гэхдээ сайжруулалт хийх хэрэгтэй;\n',
                { text: '➢ 70%-аас доош:   ', bold: true },
                'Шаардлага хангаагүй, заавал сайжруулалт хийх шаардлагатай.',
              ],
              margin: [0, 5, 0, 0] as [number, number, number, number],
            },
            {
              text: 'Шууд ба шууд бус үнэлгээний нэгдсэн шалгуурыг дараах хүснэгтээс харж болно.',
              margin: [0, 5, 0, 0] as [number, number, number, number],
            },
          ],
          style: 'body',
          type: 'lower-alpha' as const, // Automatically renders a), b), c)...
          margin: [30, 0, 0, 0] as [number, number, number, number],
        },
        { text: '', pageBreak: 'before' as const },
        {
          table: {
            headerRows: 0,
            widths: ['25%', '25%', '25%', '25%'],
            body: unifiedCriteTable,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          margin: [0, 100, 0, 0] as [number, number, number, number],
        },
        {
          text: 'Тайлбар: A: Маш сайн; B: Сайн; С: Дунд; D: Хангалтгүй',
          style: 'bodyLeft',
        },
        {
          text: '2.	ХИЧЭЭЛИЙН ЕРӨНХИЙ МЭДЭЭЛЭЛ',
          style: 'titleLeft',
          margin: [0, 20, 0, 0] as [number, number, number, number],
        },
        { text: 'Хүснэгт 2. Хичээлийн мэдээлэл', style: 'bodyRight' },
        {
          table: {
            headerRows: 0,
            widths: ['50%', '50%'],
            body: lessonDetailTable,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        { text: '', pageBreak: 'before' as const },
        {
          text: '3.	ХИЧЭЭЛЭЭР ЭЗЭМШИХ СУРАЛЦАХУЙН ҮР ДҮНГҮҮД',
          style: 'titleLeft',
          margin: [0, 20, 0, 10] as [number, number, number, number],
        },
        { text: 'Хүснэгт 3. Хичээлийн суралцахуйн үр дүн', style: 'bodyRight' },
        {
          table: {
            headerRows: 0,
            widths: ['10%', '90%'],
            body: cloTable,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        {
          text: '',
          pageBreak: 'before' as const,
          style: 'bodyCenter',
          pageOrientation: 'landscape' as const,
        },
        {
          text: '4.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮДИЙН ҮНЭЛГЭЭНИЙ ТӨЛӨВЛӨЛТ ',
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          text: [
            {
              text: '<Энд UNIMIS системд оруулсан хичээлийн үнэлгээний 15 задаргаанд харгалзах оноо нь хичээлийн суралцахуйн үр дүнгүүдийн алийг үнэлэх, түүнд оноог хэрхэн хуваарилах төлөвлөлтийг хийнэ. Дагалдах',
              style: 'bodyRed',
            },
            { text: '70.30-CLOs-khamaaral.xls ', style: 'body' },
            {
              text: 'файлын төлөвлөлт хуудсыг ашиглан хичээлийн суралцахуйн үр дүнгийн онооны хуваарилалтыг хийж тайлангийн файл руу хуулж оруулна. Харин тус файлын гүйцэтгэл хуудсыг үр дүн тооцоолоход ашиглаж болно>',
              style: 'bodyRed',
            },
          ],
        },
        { text: ' ', style: 'bodyCenter' },
        {
          text: 'Хүснэгт 4. Хичээлийн суралцахуйн үр дүнгийн шууд үнэлгээний онооны хуваарилалт/төлөвлөлтөөр/',
          style: 'bodyCenter',
        },
        {
          table: {
            headerRows: 0,
            dontBreakRows: true,
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
          pageOrientation: 'portrait' as const,
        },
        {
          text: '5.1.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ  ',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: '<Хүснэгт 4-д үзүүлсэн төлөвлөлтөд үндэслэн хичээлийн тухайн суралцахуйн үр дүн (CLOs)-нд харгалзах үнэлгээний аргыг (1-15 хүртэлх) түүвэрлэн, харгалзах гүйцэтгэлийн оноог оюутан бүрээр гаргана. Жишээ загварыг хүснэгт 5-аас 6-д үзүүлэв.>',
          margin: [20, 20, 20, 5] as [number, number, number, number],
          style: 'bodyRed',
        },
        {
          text: '5.1.1.	ТУХАЙН CLO-Д ХАРГАЛЗАХ ОЮУТНЫ ГҮЙЦЭТГЭЛИЙН ҮНЭЛГЭЭ',
          fontSize: 12,
          bold: true,
          margin: [40, 0, 20, 5] as [number, number, number, number],
        },
        ...contentAssessmentArray,
        {
          text: '5.1.2.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ҮНЭЛГЭЭНИЙ НЭГДСЭН ҮЗҮҮЛЭЛТ',
          fontSize: 12,
          bold: true,
          margin: [40, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: 'Хүснэгт 7. Зургын боловсруулалт хичээлийн нийт суралцахуйн үр дүнд харгалзах\nоюутны гүйцэтгэлийн үнэлгээ/үсгэн үнэлгээгээр/',
          style: 'bodyRightBol',
        },
        {
          table: {
            headerRows: 0,
            dontBreakRows: true,
            widths: overallWidths,
            body: overallAssesmentInd,
          },
        },
        {
          text: '',
          pageBreak: 'before' as const,
          style: 'bodyCenter',
        },
        {
          text: '5.2.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ШУУД БУС ҮНЭЛГЭЭНИЙ ГҮЙЦЭТГЭЛ',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: 'Хичээлийн суралцахуйн үр дүнг хавсралт 1-д үзүүлсэн санал асуулгын дагуу үнэлсэн бөгөөд CLO бүрээр харгалзах хариултуудыг оноогоор нь ялган, 4 ба 5 оноо буюу “маш сайн”, “сайн” гэсэн хариултын эзлэх хувийг тодорхойлсон.',
          style: 'bodyLeftNoBold',
        },
        {
          text: '5.2.1.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН САНАЛ АСУУЛГЫН ДҮН',
          fontSize: 12,
          bold: true,
          margin: [40, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: 'Хүснэгт 8. Cуралцахуйн үр дүнгийн шууд бус үнэлгээний үр дүн',
          style: 'bodyRightBol',
        },
        {
          table: {
            headerRows: 0,
            dontBreakRows: true,
            widths: [
              '8%',
              '19%',
              '11%',
              '11%',
              '11%',
              '10%',
              '10%',
              '10%',
              '14%',
            ],
            body: indirectAssesmentTable,
          },
        },
        {
          text: '',
          pageBreak: 'before' as const,
          style: 'bodyCenter',
        },
        {
          text: '5.3.	ШУУД БА ШУУД БУС ҮНЭЛГЭЭНИЙ НЭГДСЭН ҮЗҮҮЛЭЛТ',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: 'Хүснэгт 9-д үзүүлснээр ногоон өнгөөр тэмдэглэсэн үр дүнгүүд шаардлага хангаж байгаа бөгөөд шаардлагатай гэж үзвэл сайжруулалт хийж болно. Харин шар өнгөөр тэмдэглэсэн үр дүнгүүдийн гүйцэтгэлийн дундаж хувийг дээшлүүлэхийн тулд заавал сайжруулалт хийх шаардлагатай.',
          style: 'bodyLeftNoBold',
        },
        {
          text: 'Хүснэгт 9. СLOs-ийн шууд ба шууд бус үнэлгээний нэгдсэн дүн',
          style: 'bodyRightBol',
        },
        {
          table: {
            headerRows: 0,
            dontBreakRows: true,
            widths: widthsDricetIndir,
            body: direcIndirecAssesmentTable,
          },
        },
        {
          text: 'Тайлбар: A: Маш сайн; B: Сайн; С: Дунд; D: Хангалтгүй',
          style: 'bodyLeft',
        },
        {
          text: '6.	САНАЛ АСУУЛГЫН БУСАД ҮР ДҮНГҮҮДЭД ХИЙСЭН ДҮН ШИНЖИЛГЭЭ',
          fontSize: 12,
          bold: true,
          margin: [20, 15, 20, 5] as [number, number, number, number],
        },
        {
          text: 'Хичээлийн санал асуулгаар CLOs-ийн гүйцэтгэлийг тодорхойлохоос гадна хичээлийн ерөнхий үнэлгээний асуулгуудад хариулт авсан. Эдгээр асуулгуудын үр дүнг боловсруулан хүснэгт 10-д үзүүлэв. Тухайн асуулгын хувьд 3-5 оноо бүхий хариултын эзлэх хувь ямар байгаагаас хамаарч  түүнийг цаашид хэрхэн сайжруулах төлөвлөлт хийнэ.',
          style: 'bodyLeftNoBold',
        },
        {
          text: 'Хүснэгт 10. Санал асуулгын нэмэлт үр дүнгийн гүйцэтгэл',
          style: 'bodyRightBol',
        },
        {
          table: {
            headerRows: 0,
            dontBreakRows: true,
            widths: ['70%', '15%', '15%'],
            body: reportQuestionTable,
          },
        },
        {
          text: '',
          pageBreak: 'before' as const,
          style: 'bodyCenter',
        },
        {
          text: '7.	СУРАЛЦАХУЙН ҮР ДҮНГИЙН ГҮЙЦЭТГЭЛИЙГ САЙЖРУУЛАХ ТӨЛӨВЛӨЛТ',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: '7.1.	ХИЧЭЭЛИЙН ОНЦЛОГ, ДАВУУ ТАЛУУД',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: feedBackList[0].strengths,
          style: 'bodyLeftNoBold',
          margin: [0, 15, 0, 15] as [number, number, number, number],
        },
        {
          text: '7.2.	ХИЧЭЭЛИЙН СУЛ ТАЛУУД',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: feedBackList[0].weaknesses,
          style: 'bodyLeftNoBold',
          margin: [0, 15, 0, 15] as [number, number, number, number],
        },
        {
          text: '7.3.	ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГИЙН ГҮЙЦЭТГЭЛИЙГ ДЭЭШЛҮҮЛЭХ ЧИГЛЭЛЭЭР ХИЙХ АЖЛЫН ТӨЛӨВЛӨЛТ',
          fontSize: 12,
          bold: true,
          margin: [20, 0, 20, 5] as [number, number, number, number],
        },
        {
          text: 'Хичээлийн суралцахуйн үр дүнгийн гүйцэтгэлийг дээшлүүлэх зорилгоор дараагийн улиралд хэрэгжүүлэх үйл ажиллагааны чиглэлүүдийг хүснэгт 11-д үзүүлсэн байдлаар төлөвлөж байна. Сонгосон үйл ажиллагааг хэрэгжүүлэх тодорхой төлөвлөгөө гарган ажиллаж улирлын төгсгөлд үр дүнд шинжилгээ хийнэ',
          style: 'bodyLeftNoBold',
        },
        {
          text: 'Хүснэгт 11. Хичээлийн суралцахуйн үр дүнгүүдийг сайжруулах чиглэлүүд',
          style: 'bodyRightBol',
        },
        {
          table: {
            headerRows: 0,
            dontBreakRows: true,
            widths: ['15%', '85%'],
            body: feedBackTable,
          },
        },
      ],
      footer: (currentPage: number, pageCount: number): Content => ({
        text: `Хуудас ${currentPage} / ${pageCount}`,
        alignment: 'center',
        fontSize: 9,
        margin: [0, 10, 0, 0],
      }),
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
        bodyCenter: {
          fontSize: 10,
          bold: false,
          fontStyle: 'Arial',
          alignment: 'center' as const,
        },
        title: {
          fontSize: 11,
          bold: true,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
        },
        leftMargin: {
          fontSize: 10,
          bold: false,
          alignment: 'left' as const,
          margin: [50, 10, 0, 0] as [number, number, number, number],
        },
        contents: { fontSize: 10, bold: true },
        bodyLeftNoBold: {
          fontSize: 11,
          alignment: 'left' as const,
          bold: false,
        },
        bodyLeft: { fontSize: 11, alignment: 'left' as const, bold: true },
        bodyLeftInBold: {
          fontSize: 11,
          alignment: 'left' as const,
          bold: true,
        },
        titleLeft: { fontSize: 14, alignment: 'left' as const, bold: true },
        bodyRight: { fontSize: 10, alignment: 'right' as const },
        bodyRightBol: { fontSize: 10, alignment: 'right' as const, bold: true },
        bodyRightInBold: {
          fontSize: 13,
          alignment: 'right' as const,
          bold: true,
        },
        footerCenter: { fontSize: 12, alignment: 'center' as const },
        mainTitleStyle: {
          fontSize: 14,
          bold: true,
          alignment: 'center' as const,
          margin: [0, 0, 0, 30] as [number, number, number, number],
        },
        image: {
          alignment: 'center' as const,
          margin: [0, 70, 0, 100] as [number, number, number, number],
        },
        bodyRed: {
          fontSize: 10,
          color: 'red',
          margin: [0, 0, 0, 0] as [number, number, number, number], // ✅ Force it to be a tuple
        },
        tableGreenAssessment: {
          fontSize: 10,
          fontStyle: 'Arial',
          color: 'black',
          fillColor: '#D9EADA',
        },
        tableGreenBoldAssessment: {
          fontSize: 10,
          fontStyle: 'Arial',
          color: 'black',
          bold: true,
          fillColor: '#D9EADA',
        },
        bodyAssessment: { fontSize: 10, bold: false, fontStyle: 'Arial' },
        bodyCenterAssessment: {
          fontSize: 8,
          bold: false,
          fontStyle: 'Arial',
          alignment: 'center' as const,
        },
        bodyCenterFoAssessment: {
          fontSize: 10,
          bold: false,
          fontStyle: 'Arial',
          alignment: 'center' as const,
        },
        titleAssessment: {
          fontSize: 11,
          bold: true,
          fontStyle: 'Times New Roman',
          alignment: 'center' as const,
        },
        footerCenterAssessment: { fontSize: 12, alignment: 'center' as const },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
