import { Injectable } from '@angular/core';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs } from 'pdfmake/build/vfs_fonts';
export const checked =
  'data:image/png;base64,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';
export const unChecked =
  'data:image/png;base64,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';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {
    (pdfMake as any).vfs = vfs;
  }
  generatePdfTest(data: any) {
    let lessonLevel = '';

    let titleDataCheck: any[] = [];
    let cloTitleDataCheck: any[] = [];

    data.cloPoint.map((res: any, index: number) => {
      titleDataCheck = [];
      data.assessmentByLesson.plans.map((resAssess: any) => {
        let checkPoint = false;
        let subMethodId = false;

        if (resAssess.methodType === 'EXAM') {
          resAssess.subMethods.map((subMeAss: any) => {
            res.examPoints.map((pointData: any) => {
              if (pointData.subMethodId === subMeAss._id) {
                if (pointData.point > 0) {
                  subMethodId = pointData.subMethodId;
                  checkPoint = true;
                }
              }
            });
          });
        } else {
          resAssess.subMethods.map((subMeAss: any) => {
            res.procPoints.map((pointData: any) => {
              if (pointData.subMethodId === subMeAss._id) {
                if (pointData.point > 0) {
                  subMethodId = pointData.subMethodId;
                  checkPoint = true;
                }
              }
            });
          });
        }
        let sentData: any;
        if (checkPoint) {
          const dataSet = {
            methodName: resAssess.methodName,
            methodType: resAssess.methodType,
            frequency: resAssess.frequency,
            subMethodId: subMethodId,
            point: 1,
            check: true,
            id: resAssess._id,
          };
          sentData = dataSet;
        } else {
          const dataSet = {
            methodName: resAssess.methodName,
            methodType: resAssess.methodType,
            frequency: resAssess.frequency,
            subMethodId: subMethodId,
            point: 0,
            check: false,
            id: resAssess._id,
          };
          sentData = dataSet;
        }
        titleDataCheck.push(sentData);
      });
      const cloDataSet = {
        cloId: res.cloId,
        cloSubName: 'CLO ' + (index + 1),
        cloType: res.cloType,
        cloumnData: titleDataCheck,
        order: index,
      };
      cloTitleDataCheck.push(cloDataSet);
    });
    cloTitleDataCheck = cloTitleDataCheck.map((res, index) => {
      // cloId-оор тохирох name-ийг data.cloList-с хайх
      const matchedClo = data.cloList.find(
        (item: { id: any }) => item.id === res.cloId
      );
      const cloName = matchedClo ? matchedClo.cloName : '';

      return {
        ...res, // өмнөх бүх өгөгдлийг үлдээнэ
        cloName: cloName, // name нэмэх
      };
    });
    console.log(cloTitleDataCheck);

    if (data.mainInfo.lessonLevel === 'MAGISTER') {
      lessonLevel = 'Магистр';
    } else if (data.mainInfo.lessonLevel === 'BACHELOR') {
      lessonLevel = 'Бакалавр';
    } else if (data.mainInfo.lessonLevel === 'DOCTOR') {
      lessonLevel = 'Доктор';
    } else {
      // sonar aldaa..
    }
    let lessonType = '';
    if (data.mainInfo.lessonType === 'REQ') {
      lessonType = 'Заавал';
    } else if (data.mainInfo.lessonType === 'CHO') {
      lessonType = 'Сонгон';
    } else {
      // sonar aldaa..
    }
    let recommendedSemester = '';
    if (data.mainInfo.recommendedSemester === 'autumn') {
      recommendedSemester = 'Намар';
    } else if (data.mainInfo.recommendedSemester === 'spring') {
      recommendedSemester = 'Хавар';
    } else if (data.mainInfo.recommendedSemester === 'any') {
      recommendedSemester = 'Дурын';
    } else if (data.mainInfo.recommendedSemester === 'winter') {
      recommendedSemester = 'Өвлийн';
    } else {
      // sonar aldaa..
    }
    const mainInfo = data.mainInfo;

    function aggerTo() {
      let rows: any[] = [];
      if (data.scheduleSems > 0) {
        const headTitle = [
          { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
          {
            text: 'Семинарын сэдэв',
            colSpan: 7,
            alignment: 'center',
            style: 'tableHeader',
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {
            text: 'Цаг',
            colSpan: 2,
            alignment: 'center',
            style: 'tableHeader',
          },
          {},
        ];
        const headData = data.scheduleSems.map(
          (row: { week: any; title: any; time: any }, index: any) => [
            {
              text: row.week,
              alignment: 'center',
              style: 'tableData',
            },
            {
              text: row.title,
              alignment: 'left',
              colSpan: 7,
              style: 'tableData',
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {
              text: row.time,
              colSpan: 2,
              alignment: 'center',
              style: 'tableData',
            },
            {},
          ]
        );
        rows.push(headTitle, headData);
      }
      return rows;
    }

    const semRowData = aggerTo();

    const deliveryModes = [
      { label: 'Тонгоруу анги', value: 'CLASS' },
      { label: 'Төсөлд суурилсан сургалт', value: 'PROJECT' },
      { label: 'Туршилтад суурилсан сургалт', value: 'EXPERIMENT' },
      { label: 'Асуудалд суурилсан сургалт', value: 'PROBLEM' },
    ];

    const pedagogyOptions = [
      { label: 'Лекц', value: 'Lecture' },
      { label: 'Хэлэлцүүлэг, семинар', value: 'Discussion' },
      { label: 'Лаборатори, туршилт', value: 'Laboratory' },
      { label: 'Практик', value: 'Practice' },
    ];
    const lessonAddition = [
      {
        order: 1,
        detail: 'asdfasdfa',
      },
      {
        order: 2,
        detail: 'QWEQWE',
      },
      {
        order: 3,
        detail: 'zxczxczx',
      },
    ];
    const cloTableData = [
      {
        order: 1,
        cloLessonType: 'LEKTS',
        title: 'Блок схем загварчлах',
        lessonActive: '☑',
        homework: '☐',
        progressTest: '☑',
        kursProject: '☑',
        labWork: '☑',
        finalExam: '☑',
      },
      {
        order: 2,
        cloLessonType: 'CLAB',
        title: 'Блок схем загварчлах',
        lessonActive: '☑',
        homework: '☐',
        progressTest: '☑',
        kursProject: '☑',
        labWork: '☑',
        finalExam: '☑',
      },
      {
        order: 3,
        cloLessonType: 'LEKTS',
        title: 'Блок схем загварчлах',
        lessonActive: '☑',
        homework: '☐',
        progressTest: '☑',
        kursProject: '☑',
        labWork: '☑',
        finalExam: '☑',
      },
    ];
    const tableBody = [
      // Header row
      [
        {
          text: 'Хичээлийн хөтөлбөр\n/COURSE SYLLABUS/',
          colSpan: 10,
          alignment: 'center',
          style: 'tableHeader',
        },
        {}, // Empty cell because of colSpan (consumed)
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
        {
          text: 'ХИЧЭЭЛИЙН ҮНДСЭН МЭДЭЭЛЭЛ',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
        {}, // Empty cell because of colSpan (consumed)
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
        {
          text: 'Хичээлийн нэр:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.lessonName,
          colSpan: 8,
          alignment: 'left',
          style: 'tableData',
        },
        {}, // Empty cell because of colSpan (consumed)
        {},
        {},
        {},
        {},
        {},
        {},
      ],
      [
        {
          text: 'Хичээлийн код:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.lessonCode,
          colSpan: 2,
          alignment: 'left',
          style: 'colorTable',
        },
        {},
        {
          text: 'Хичээлийн кредит:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.lessonCredit,
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'Салбар/Тэнхим:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.departmentName,
          colSpan: 2,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {
          text: 'Сургууль:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.schoolName,
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'Үндсэн багшийн нэр:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.teacher.name,
          colSpan: 2,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {
          text: 'Өрөөний дугаар:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.teacher.room,
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'E-мэйл хаяг:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.teacher.email,
          colSpan: 2,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {
          text: 'Утасны дугаар:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.teacher.phone,
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'Туслах багшийн нэр:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.assistantTeacher.name,
          colSpan: 2,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {
          text: 'Өрөөний дугаар:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.assistantTeacher.room,
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'E-мэйл хаяг:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.assistantTeacher.email,
          colSpan: 2,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {
          text: 'Утасны дугаар:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.assistantTeacher.phone,
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'Хичээлийн өмнөх холбоо:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        { text: ' ', colSpan: 8, alignment: 'left', style: 'tableData' },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
      ],
      [
        {
          text: '7 хоногт ногдох сургалтын цаг:',
          colSpan: 2,
          rowSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        { text: 'Лекц', alignment: 'center', style: 'tableData' },
        { text: 'Семинар', alignment: 'center', style: 'tableData' },
        {
          text: 'Лаборатори',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: 'Бие даалт',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: 'Практик',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
      ],
      [
        {},
        {},
        {
          text: mainInfo.weeklyHours.lecture,
          alignment: 'center',
          style: 'tableData',
        },
        {
          text: mainInfo.weeklyHours.seminar,
          alignment: 'center',
          style: 'tableData',
        },
        {
          text: mainInfo.weeklyHours.lab,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: mainInfo.weeklyHours.assignment,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: mainInfo.weeklyHours.practice,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
      ],
      [
        {
          text: 'Нийт танхимын цаг:',
          colSpan: 2,
          rowSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        { text: 'Лекц', alignment: 'center', style: 'tableData' },
        { text: 'Семинар', alignment: 'center', style: 'tableData' },
        {
          text: 'Лаборатори',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: 'Бие даалт',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: 'Практик',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
      ],
      [
        {},
        {},
        {
          text: mainInfo.totalHours.lecture,
          alignment: 'center',
          style: 'tableData',
        },
        {
          text: mainInfo.totalHours.seminar,
          alignment: 'center',
          style: 'tableData',
        },
        {
          text: mainInfo.totalHours.lab,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: mainInfo.totalHours.assignment,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: mainInfo.totalHours.practice,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
      ],
      [
        {
          text: 'Бие даан суралцах цаг:',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          text: mainInfo.selfStudyHours.lecture,
          alignment: 'center',
          style: 'tableData',
        },
        {
          text: mainInfo.selfStudyHours.seminar,
          alignment: 'center',
          style: 'tableData',
        },
        {
          text: mainInfo.selfStudyHours.lab,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: mainInfo.selfStudyHours.assignment,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
        {
          text: mainInfo.selfStudyHours.practice,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData',
        },
        {},
      ],
      [
        {
          text: 'Хичээлийн түвшин/төрөл:',
          colSpan: 2,
          rowSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          colSpan: 8,
          rowSpan: 2,
          alignment: 'left',
          style: 'tableData',
          stack: [
            {
              columns: [
                {
                  image:
                    data.mainInfo.lessonLevel === 'BACHELOR'
                      ? checked
                      : unChecked,
                  width: 10,
                  height: 10,
                },
                { text: 'Бакалавр', margin: [5, 0, 10, 0] },
                {
                  image:
                    data.mainInfo.lessonLevel === 'MAGISTER'
                      ? checked
                      : unChecked,
                  width: 10,
                  height: 10,
                },
                { text: 'Магистр', margin: [5, 0, 10, 0] },
                {
                  image:
                    data.mainInfo.lessonLevel === 'DOCTOR'
                      ? checked
                      : unChecked,
                  width: 10,
                  height: 10,
                },
                { text: 'Доктор', margin: [5, 0, 10, 0] },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ],
            },
            {
              columns: [
                {
                  image:
                    data.mainInfo.lessonType === 'REQ' ? checked : unChecked,
                  width: 10,
                  height: 10,
                },
                { text: 'Заавал', margin: [5, 0, 10, 0] },
                {
                  image:
                    data.mainInfo.lessonType === 'CHO' ? checked : unChecked,
                  width: 10,
                  height: 10,
                },
                { text: 'Сонгон', margin: [5, 0, 10, 0] },
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
              margin: [0, 5, 0, 0],
            },
          ],
        },
        {},
        {},
        {},
        {},
        {},
        {},
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        {
          text: 'Санал болгох улирал',
          colSpan: 2,
          alignment: 'left',
          style: 'tableHeader',
        },
        {},
        {
          colSpan: 8,
          rowSpan: 2,
          alignment: 'left',
          style: 'tableData',
          columns: [
            {
              image:
                data.mainInfo.recommendedSemester === 'autumn'
                  ? checked
                  : unChecked,
              width: 10,
              height: 10,
            },
            { text: 'Намар', margin: [3, 0, 8, 0] },
            {
              image:
                data.mainInfo.recommendedSemester === 'spring'
                  ? checked
                  : unChecked,
              width: 10,
              height: 10,
            },
            { text: 'Хавар', margin: [3, 0, 8, 0] },
            {
              image:
                data.mainInfo.recommendedSemester === 'any'
                  ? checked
                  : unChecked,
              width: 10,
              height: 10,
            },
            { text: 'Дурын', margin: [3, 0, 15, 0] },
            {
              image:
                data.mainInfo.recommendedSemester === 'winter'
                  ? checked
                  : unChecked,
              width: 10,
              height: 10,
            },
            { text: 'Өвлийн', margin: [3, 0, 8, 0] },
            {},
            {},
            {},
            {},
          ],
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
      ],
      [
        {
          text: 'ХИЧЭЭЛД АШИГЛАХ МАТЕРИАЛУУД',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        {
          text: 'Үндсэн сурах бичиг:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        {
          ul: data.materials.mainBooks.map((row: any) => row),
          colSpan: 10,
          style: 'tableData',
        },
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
        {
          text: 'Нэмэлт ном, материалууд:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        {
          ul: data.materials.extraMaterials.map((row: any) => row),
          colSpan: 10,
          style: 'tableData',
        },
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
        {
          text: 'Цахим сургалтын веб холбооснууд:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        {
          text: data.materials.webLinks,
          colSpan: 10,
          style: 'tableData',
        },
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
        {
          text: 'Цахим номын сангийн холбоос:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        {
          text: data.materials.libraryLink,
          colSpan: 10,
          style: 'tableData',
        },
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
        {
          text: 'Хичээлд ашиглах программ хангамж, хэрэгслүүд:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        {
          ul: data.materials.softwareTools.map((row: any) => row),
          colSpan: 10,
          style: 'tableData',
        },
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
        {
          text: 'ХИЧЭЭЛИЙН ТОДОРХОЙЛОЛТ',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        {
          text: data.definition[0].description,
          colSpan: 10,
          alignment: 'left',
          style: 'tableData',
        },
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
        {
          text: 'ХИЧЭЭЛИЙН ЗОРИЛГО',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        {
          text: data.definition[0].goal,
          colSpan: 10,
          alignment: 'left',
          style: 'tableData',
        },
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
        {
          text: 'ХИЧЭЭЛИЙН АГУУЛГА, ЦАГИЙН ХУВААРИЛАЛТ',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        {
          text: 'Лекцийн агуулга:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
        {
          text: 'Лекц, семинарын сэдэв',
          colSpan: 7,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Цаг', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
      ],
      ...data.schedules.map(
        (row: { week: any; title: any; time: any }, index: any) => [
          {
            text: row.week,
            alignment: 'center',
            style: 'tableData',
          },
          {
            text: row.title,
            alignment: 'left',
            colSpan: 7,
            style: 'tableData',
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {
            text: row.time,
            colSpan: 2,
            alignment: 'center',
            style: 'tableData',
          },
          {},
        ]
      ),
      ...semRowData,
      [
        {
          text: 'Лаборатори/практикийн хичээлийн агуулга:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
        {
          text: 'Лаборатори/практикийн сэдэв ',
          colSpan: 7,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Цаг', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
      ],
      ...data.scheduleLabs.map(
        (row: { week: any; title: any; time: any }, index: any) => [
          {
            text: row.week,
            alignment: 'center',
            style: 'tableData',
          },
          {
            text: row.title,
            alignment: 'left',
            colSpan: 7,
            style: 'tableData',
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {
            text: row.time,
            colSpan: 2,
            alignment: 'center',
            style: 'tableData',
          },
          {},
        ]
      ),
      [
        {
          text: [
            { text: 'Бие даан судлах агуулга:', bold: true },
            {
              text: ' (Энд заасан сэдвийн дагуу багш оюутантай ажиллаж давтлага зөвлөгөө өгөх; бие даалтын даалгавар өгөх, шалгах; шалгалт, тест авах зэрэг үйл ажиллагааг гүйцэтгэнэ. Мөн оюутан эдгээр даалгаврын хүрээнд танхимын бус цагаар бие даан суралцана) ',
            },
          ],
          colSpan: 10,
          alignment: 'left',
          style: 'tableData',
        },
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
        { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
        {
          text: 'Бие даалтын сэдэв',
          colSpan: 5,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {},
        {},
        {
          text: 'Танхимд зөвлөгөө авах, үнэлүүлэх цаг',
          colSpan: 2,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {
          text: 'Бие даан суралцах цаг',
          colSpan: 2,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
      ],
      ...data.scheduleBds.map(
        (
          row: { week: any; title: any; adviceTime: any; time: any },
          index: any
        ) => [
          {
            text: row.week,
            alignment: 'center',
            style: 'tableData',
          },
          {
            text: row.title,
            alignment: 'left',
            colSpan: 5,
            style: 'tableData',
          },
          {},
          {},
          {},
          {},
          {
            text: row.adviceTime,
            colSpan: 2,
            alignment: 'center',
            style: 'tableData',
          },
          {},
          {
            text: row.time,
            colSpan: 2,
            alignment: 'center',
            style: 'tableData',
          },
          {},
        ]
      ),
      [
        {
          text: [
            {
              text: 'ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮД (Course Learning Outcomes)\n',
            },
            {
              text: 'Оюутан энэ хичээлийг амжилттай судалж дууссанаар дараах мэдлэг, чадвар, хандлагыг эзэмшсэн байна',
              bold: false,
            },
          ],
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        {
          text: 'Лекц, семинарын хичээлийн суралцахуйн үр дүнгүүд:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        { text: 'д/д', alignment: 'center', style: 'tableHeader' },
        {
          text: 'Суралцахуйн үр дүнгүүд',
          colSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {
          text: 'Мэдлэг',
          colSpan: 2,
          alignment: 'center',
          style: 'colorTable',
        },
        {},
        {
          text: 'Чадвар',
          colSpan: 2,
          alignment: 'center',
          style: 'colorTable',
        },
        {},
        {
          text: 'Хандлага',
          colSpan: 2,
          alignment: 'center',
          style: 'colorTable',
        },
        {},
      ],
      ...data.cloList
        .filter((row: { type: string }) => row.type === 'ALEC')
        .map(
          (
            row: {
              order: any;
              cloName: any;
              knowledge: boolean;
              skill: boolean;
              attitude: boolean;
            },
            index: any
          ) => [
            {
              text: row.order,
              alignment: 'center',
              style: 'tableData',
            },
            {
              text: row.cloName,
              alignment: 'left',
              colSpan: 3,
              style: 'tableData',
            },
            {},
            {},
            {
              image: row.knowledge == true ? checked : unChecked,
              colSpan: 2,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {},
            {
              image: row.skill == true ? checked : unChecked,
              colSpan: 2,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {},
            {
              image: row.attitude == true ? checked : unChecked,
              colSpan: 2,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {},
          ]
        ),

      [
        {
          text: 'Лаборатори/практикийн хичээлийн суралцахуйн үр дүнгүүд:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
        { text: 'д/д', alignment: 'center', style: 'tableHeader' },
        {
          text: 'Суралцахуйн үр дүнгүүд',
          colSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {
          text: 'Мэдлэг',
          colSpan: 2,
          alignment: 'center',
          style: 'colorTable',
        },
        {},
        {
          text: 'Чадвар',
          colSpan: 2,
          alignment: 'center',
          style: 'colorTable',
        },
        {},
        {
          text: 'Хандлага',
          colSpan: 2,
          alignment: 'center',
          style: 'colorTable',
        },
        {},
      ],
      ...data.cloList
        .filter((row: { type: string }) => row.type === 'CLAB')
        .map(
          (
            row: {
              order: any;
              cloName: any;
              knowledge: boolean;
              skill: boolean;
              attitude: boolean;
            },
            index: any
          ) => [
            {
              text: row.order,
              alignment: 'center',
              style: 'tableData',
            },
            {
              text: row.cloName,
              alignment: 'left',
              colSpan: 3,
              style: 'tableData',
            },
            {},
            {},
            {
              image: row.knowledge == true ? checked : unChecked,
              colSpan: 2,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {},
            {
              image: row.skill == true ? checked : unChecked,
              colSpan: 2,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {},
            {
              image: row.attitude == true ? checked : unChecked,
              colSpan: 2,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {},
          ]
        ),
      [
        {
          text: 'СУРГАХ, СУРАЛЦАХ АРГА ЗҮЙ (Teaching and Learning Method)',
          colSpan: 10,
          alignment: 'left',
          style: 'tableData',
        },
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
        {
          text: 'Хичээлийн хэлбэр',
          colSpan: 2,
          rowSpan: 2,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {
          text: 'Сургалтын арга зүй',
          colSpan: 3,
          rowSpan: 2,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {
          text: 'Сургалтын хэлбэр',
          colSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {
          text: 'CLOs\nхамаарал',
          colSpan: 2,
          rowSpan: 2,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
      ],
      [
        {},
        {},
        {},
        {},
        {},
        { text: 'Танхим', alignment: 'center', style: 'tableData' },
        { text: 'Цахим', alignment: 'center', style: 'tableData' },
        { text: 'Хосолсон', alignment: 'center', style: 'tableData' },
        {},
        {},
      ],

      ...data.method.map(
        (
          row: {
            cloRelevance: any;
            classroom: boolean;
            electronic: boolean;
            combined: boolean;
            pedagogy: string;
            deliveryMode: any;
            title: any;
            time: any;
          },
          index: any
        ) => [
          {
            text:
              pedagogyOptions.find((e) => e.value === row.pedagogy)?.label ||
              '',
            colSpan: 2,
            alignment: 'center',
            style: 'tableData',
          },
          {},
          {
            text:
              deliveryModes.find((e) => e.value === row.deliveryMode)?.label ||
              '',
            colSpan: 3,
            alignment: 'center',
            style: 'tableData',
          },
          {},
          {},
          {
            image: row.classroom == true ? checked : unChecked,
            alignment: 'center',
            width: 12,
            style: 'tableData',
          },
          {
            image: row.electronic == true ? checked : unChecked,
            alignment: 'center',
            width: 12,
            style: 'tableData',
          },
          {
            image: row.combined == true ? checked : unChecked,
            alignment: 'center',
            width: 12,
            style: 'tableData',
          },
          {
            text: row.cloRelevance.map((item: any) => item.cloName).join(', '),
            colSpan: 2,
            alignment: 'center',
            style: 'tableData',
          },
          {},
        ]
      ),
      [
        {
          text: 'ХИЧЭЭЛИЙН ҮНЭЛГЭЭ (Course assessment)',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        { text: 'д/д', rowSpan: 3, alignment: 'center', style: 'tableHeader' },
        {
          text: 'Суралцахуйн үр дүнгүүд',
          colSpan: 3,
          rowSpan: 3,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {
          text: 'Үнэлгээнийй аргууд',
          colSpan: 6,
          alignment: 'center',
          style: 'tableHeader',
        },
        {},
        {},
        {},
        {},
        {},
      ],
      [
        {},
        {},
        {},
        {},
        {
          text: 'Ирц/Хичээлд\nоролцсон\nбайдал',
          alignment: 'left',
          style: 'tableData',
        },
        {
          text: 'Даалгавар/\nБие даалт',
          alignment: 'left',
          style: 'tableData',
        },
        {
          text: 'Явцын\nшалгалт/\nСорил 1',
          alignment: 'left',
          style: 'tableData',
        },
        {
          text: 'Явцын\nшалгалт/\nСорил 2',
          alignment: 'left',
          style: 'tableData',
        },
        { text: 'Лабораторийн\nажил', alignment: 'left', style: 'tableData' },
        {
          text: 'Улирлын шалгалт\n(30 оноо)',
          rowSpan: 2,
          alignment: 'left',
          style: 'tableData',
        },
      ],
      [
        {},
        {},
        {},
        {},
        {
          text: 'Явцын үнэлгээ (70 оноо)',
          colSpan: 5,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
        {},
        {},
      ],
      [
        {
          text: 'Лекц, семинарын хичээлийн суралцахуйн үр дүнгүүд:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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
      // -------------------- Zasvar ----------------------
      ...cloTitleDataCheck
        .filter((row: { cloType: string }) => row.cloType === 'ALEC')
        .map(
          (
            row: {
              order: any;
              cloName: any;
              cloumnData: any;
              skill: any;
              attitude: any;
            },
            index: any
          ) => [
            {
              text: ++index,
              alignment: 'center',
              style: 'tableData',
            },
            {
              text: row.cloName,
              alignment: 'left',
              colSpan: 3,
              style: 'tableData',
            },
            {},
            {},
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'PARTI'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any; methodName: any }) =>
                    item.methodType === 'PROC' &&
                    item.methodName === 'Даалгавар'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'QUIZ1'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'QUIZ2'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any; methodName: any }) =>
                    item.methodType === 'PROC' &&
                    item.methodName !== 'Даалгавар'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'EXAM'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
          ]
        ),
      [
        {
          text: 'Лаборатори/практикийн хичээлийн суралцахуйн үр дүнгүүд:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableHeader',
        },
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

      ...cloTitleDataCheck
        .filter((row: { cloType: string }) => row.cloType === 'CLAB')
        .map(
          (
            row: {
              order: any;
              cloName: any;
              cloumnData: any;
              skill: any;
              attitude: any;
            },
            index: any
          ) => [
            {
              text: ++index,
              alignment: 'center',
              style: 'tableData',
            },
            {
              text: row.cloName,
              alignment: 'left',
              colSpan: 3,
              style: 'tableData',
            },
            {},
            {},
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'PARTI'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any; methodName: any }) =>
                    item.methodType === 'PROC' &&
                    item.methodName === 'Даалгавар'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'QUIZ1'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'QUIZ2'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any; methodName: any }) =>
                    item.methodType === 'PROC' &&
                    item.methodName !== 'Даалгавар'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
            {
              image:
                row.cloumnData.find(
                  (item: { methodType: any }) => item.methodType === 'EXAM'
                )?.check === true
                  ? checked
                  : unChecked,
              width: 12,
              alignment: 'center',
              style: 'tableData',
            },
          ]
        ),
      [
        {
          text: 'ХИЧЭЭЛД ТАВИГДАХ НЭМЭЛТ ШААРДЛАГУУД:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        {
          ul: data.additional.additional.map(
            (row: { [x: string]: any }, index: number) => `${row}`
          ),
          colSpan: 10,
          style: 'tableData',
        },
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
        {
          text: 'БАТАЛГААЖУУЛАЛТ:',
          colSpan: 10,
          alignment: 'left',
          style: 'tableTitle',
        },
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
        {
          text: 'Боловсруулсан багш:\n' + mainInfo.createdTeacherBy,
          colSpan: 3,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {
          text: 'Гарын үсэг',
          colSpan: 3,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {
          text: mainInfo.createdTeacherDatetime.slice(0, 10),
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
      [
        {
          text: 'Боловсруулсан багш:\n' + mainInfo.checkManagerBy,
          colSpan: 3,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {
          text: 'Гарын үсэг',
          colSpan: 3,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {
          text: mainInfo.checkManagerDatetime.slice(0, 10),
          colSpan: 4,
          alignment: 'left',
          style: 'tableData',
        },
        {},
        {},
        {},
      ],
    ];

    const documentDefinition = {
      content: [
        // { text: 'PDF Title', style: 'header' },
        // { text: 'This is a sample PDF generated using pdfMake in Angular.', style: 'body' },
        {
          table: {
            headerRows: 0,
            widths: [
              '10%',
              '10%',
              '16%',
              '16%',
              '8%',
              '8%',
              '8%',
              '8%',
              '8%',
              '8%',
            ],
            body: tableBody,
            dontBreakRows: true,
            // keepWithHeaderRows: true
          },
        },
      ],
      pageMargins: [40, 40, 40, 40] as [number, number, number, number],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        body: {
          fontSize: 12,
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        tableHeader: {
          fontSize: 10,
          fontStyle: 'Arial',
          bold: true,
          color: 'black',
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        colorTable: {
          fontSize: 10,
          fontStyle: 'Arial',
          bold: true,
          color: 'black',
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        tableTitle: {
          fontSize: 12,
          bold: true,
          color: 'black',
          fontStyle: 'Arial',
          fillColor: '#FFF2CC',
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        tableData: {
          fontSize: 10,
          fontStyle: 'Arial',
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
