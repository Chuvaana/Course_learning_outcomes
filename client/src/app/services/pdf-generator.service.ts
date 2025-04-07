import { Injectable } from '@angular/core';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs } from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
    (pdfMake as any).vfs = vfs;
  }
  generatePdfTest(data: any) {

    let lessonLevel = '';
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

    const deliveryModes =
      [
        { label: 'Тонгоруу анги', value: 'CLASS' },
        { label: 'Төсөлд суурилсан сургалт', value: 'PROJECT' },
        { label: 'Туршилтад суурилсан сургалт', value: 'EXPERIMENT' },
        { label: 'Асуудалд суурилсан сургалт', value: 'PROBLEM' }
      ];

    const pedagogyOptions = [
      { label: 'Лекц', value: 'Lecture' },
      { label: 'Хэлэлцүүлэг, семинар', value: 'Discussion' },
      { label: 'Лаборатори, туршилт', value: 'Laboratory' },
      { label: 'Практик', value: 'Practice' }
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
        cloLessonType: 'LAB',
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
    ]
    const tableBody = [
      // Header row
      [
        { text: 'Хичээлийн хөтөлбөр\n/COURSE SYLLABUS/', colSpan: 10, alignment: 'center', style: 'tableHeader' },
        {}, // Empty cell because of colSpan (consumed)
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
        { text: 'ХИЧЭЭЛИЙН ҮНДСЭН МЭДЭЭЛЭЛ', colSpan: 10, alignment: 'left', style: 'tableTitle' },
        {}, // Empty cell because of colSpan (consumed)
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
        { text: 'Хичээлийн нэр:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.lessonName, colSpan: 8, alignment: 'left', style: 'tableData' },
        {}, // Empty cell because of colSpan (consumed)
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { text: 'Хичээлийн код:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.lessonCode, colSpan: 2, alignment: 'left', style: 'colorTable' },
        {},
        { text: 'Хичээлийн кредит:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.lessonCredit, colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Салбар/Тэнхим:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.department, colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Сургууль:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.school, colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Үндсэн багшийн нэр:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.teacher.name, colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Өрөөний дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.teacher.room, colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'E-мэйл хаяг:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.teacher.email, colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Утасны дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.teacher.phone, colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Туслах багшийн нэр:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.assistantTeacher.name, colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Өрөөний дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.assistantTeacher.room, colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'E-мэйл хаяг:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.assistantTeacher.email, colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Утасны дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.assistantTeacher.phone, colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Хичээлийн өмнөх холбоо:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: ' ', colSpan: 8, alignment: 'left', style: 'tableData' },
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { text: '7 хоногт ногдох сургалтын цаг:', colSpan: 2, rowSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'Лекц', alignment: 'center', style: 'tableData' },
        { text: 'Семинар', alignment: 'center', style: 'tableData' },
        { text: 'Лаборатори', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Бие даалт', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Практик', colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        {},
        {},
        { text: mainInfo.weeklyHours.lecture, alignment: 'center', style: 'tableData' },
        { text: mainInfo.weeklyHours.seminar, alignment: 'center', style: 'tableData' },
        { text: mainInfo.weeklyHours.lab, colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: mainInfo.weeklyHours.assignment, colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: mainInfo.weeklyHours.practice, colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Нийт танхимын цаг:', colSpan: 2, rowSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'Лекц', alignment: 'center', style: 'tableData' },
        { text: 'Семинар', alignment: 'center', style: 'tableData' },
        { text: 'Лаборатори', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Бие даалт', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Практик', colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        {},
        {},
        { text: mainInfo.totalHours.lecture, alignment: 'center', style: 'tableData' },
        { text: mainInfo.totalHours.seminar, alignment: 'center', style: 'tableData' },
        { text: mainInfo.totalHours.lab, colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: mainInfo.totalHours.assignment, colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: mainInfo.totalHours.practice, colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Бие даан суралцах цаг:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: mainInfo.selfStudyHours.lecture, alignment: 'center', style: 'tableData' },
        { text: mainInfo.selfStudyHours.seminar, alignment: 'center', style: 'tableData' },
        { text: mainInfo.selfStudyHours.lab, colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: mainInfo.selfStudyHours.assignment, colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: mainInfo.selfStudyHours.practice, colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Хичээлийн түвшин/төрөл:', colSpan: 2, rowSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: '☑ Бакалавр ☐ Магистр ☐ Доктор\n☑ Заавал ☐ Сонгон ', colSpan: 8, rowSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      [
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
        { text: 'Санал болгох улирал', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: '☑ Намар ☑ Хавар ☐ Дурын ☐ Өвлийн улирал ☐ Зуны улирал', colSpan: 8, alignment: 'left', style: 'tableData' },
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { text: 'ХИЧЭЭЛД АШИГЛАХ МАТЕРИАЛУУД', colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        { text: 'Үндсэн сурах бичиг:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        {
          ul: data.materials.mainBooks.map((row: any) => row),
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: 'Нэмэлт ном, материалууд:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        {
          ul: data.materials.extraMaterials.map((row: any) => row),
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: 'Цахим сургалтын веб холбооснууд:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        {
          text: data.materials.webLinks,
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: 'Цахим номын сангийн холбоос:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        {
          text: data.materials.libraryLink,
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: 'Хичээлд ашиглах программ хангамж, хэрэгслүүд:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        {
          ul: data.materials.softwareTools.map((row: any) => row),
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: 'ХИЧЭЭЛИЙН ТОДОРХОЙЛОЛТ', colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        { text: data.definition[0].description, colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        {
          text: 'Уг хичээлээр програмчлалын Си хэлэн дээр тулгуурлан бүтэцлэгдсэн программ хөгжүүлэх арга техникүүдийг үзнэ. Сэдвүүд: Си хэл дээрх бүтэцлэгдсэн программчлал, функц, массив, заагч, тэмдэгт мөр, хэлбэржүүлсэн оролт/гаралт, бүтэц, нэгдэл, тоочих төрөл, файл боловсруулалт, үндсэн өгөгдлийн бүтцүүд, хөрвүүлэгчийн директив судлах болно.',
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: data.definition[0].goal, colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        { text: 'ХИЧЭЭЛИЙН ЗОРИЛГО', colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        {
          text: 'Энэхүү хичээл нь программчлалын үндсэн суурь ойлголтууд өгөх, тэдгээрийг хэрэгжүүлэх, асуудлыг шийдвэрлэх үндсэн алхамууд болон логик бүтцийг, бодит асуудлуудыг шийдвэрлэх алгоритмуудыг боловсруулж, хэрэгжүүлэхэд сургах зорилготой. ',
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: 'ХИЧЭЭЛИЙН АГУУЛГА, ЦАГИЙН ХУВААРИЛАЛТ', colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        { text: 'Лекцийн агуулга:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
        { text: 'Лекц, семинарын сэдэв', colSpan: 7, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Цаг', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...data.schedules.map((row: { week: any; title: any; time: any; }, index: any) => [
        {
          text: row.week,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          alignment: 'left',
          colSpan: 7,
          style: 'tableData'
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
          style: 'tableData'
        },
        {}
      ]),
      [
        { text: 'Семинарын агуулга:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
        { text: 'Семинарын сэдэв', colSpan: 7, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Цаг', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...data.scheduleSems.map((row: { week: any; title: any; time: any; }, index: any) => [
        {
          text: row.week,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          alignment: 'left',
          colSpan: 7,
          style: 'tableData'
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
          style: 'tableData'
        },
        {}
      ]),
      [
        { text: 'Лаборатори/практикийн хичээлийн агуулга:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
        { text: 'Лаборатори/практикийн сэдэв ', colSpan: 7, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Цаг', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...data.scheduleLabs.map((row: { week: any; title: any; time: any; }, index: any) => [
        {
          text: row.week,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          alignment: 'left',
          colSpan: 7,
          style: 'tableData'
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
          style: 'tableData'
        },
        {}
      ]),
      [
        {
          text: [
            { text: 'Бие даан судлах агуулга:', bold: true },
            { text: ' (Энд заасан сэдвийн дагуу багш оюутантай ажиллаж давтлага зөвлөгөө өгөх; бие даалтын даалгавар өгөх, шалгах; шалгалт, тест авах зэрэг үйл ажиллагааг гүйцэтгэнэ. Мөн оюутан эдгээр даалгаврын хүрээнд танхимын бус цагаар бие даан суралцана) ' }
          ], colSpan: 10, alignment: 'left', style: 'tableData'
        },
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
        { text: '7 хоног', alignment: 'center', style: 'tableHeader' },
        { text: 'Бие даалтын сэдэв', colSpan: 5, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        {},
        {},
        { text: 'Танхимд зөвлөгөө авах, үнэлүүлэх цаг', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'Бие даан суралцах цаг', colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...data.scheduleBds.map((row: { week: any; title: any; adviceTime: any; time: any; }, index: any) => [
        {
          text: row.week,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          alignment: 'left',
          colSpan: 5,
          style: 'tableData'
        },
        {},
        {},
        {},
        {},
        {
          text: row.adviceTime,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.time,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {}
      ]),
      [
        {
          text: [
            { text: 'ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮД (Course Learning Outcomes)\n' },
            { text: 'Оюутан энэ хичээлийг амжилттай судалж дууссанаар дараах мэдлэг, чадвар, хандлагыг эзэмшсэн байна', bold: false }
          ], colSpan: 10, alignment: 'left', style: 'tableTitle'
        },
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
        { text: 'Лекц, семинарын хичээлийн суралцахуйн үр дүнгүүд:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        { text: 'д/д', alignment: 'center', style: 'tableHeader' },
        { text: 'Суралцахуйн үр дүнгүүд', colSpan: 3, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        { text: 'Мэдлэг', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Чадвар', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Хандлага', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {}
      ],
      ...data.cloList.filter((row: { type: string; }) => row.type === 'LEC_SEM').map((row: { order: any; cloName: any; knowledge: boolean; skill: boolean; attitude: boolean; }, index: any) => [
        {
          text: row.order,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.cloName,
          alignment: 'left',
          colSpan: 3,
          style: 'tableData'
        },
        {},
        {},
        {
          text: row.knowledge == true ? 'true' : 'false',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.skill == true ? 'true' : 'false',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.attitude == true ? 'true' : 'false',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {}
      ]),

      [
        { text: 'Лаборатори/практикийн хичээлийн суралцахуйн үр дүнгүүд:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
        { text: 'д/д', alignment: 'center', style: 'tableHeader' },
        { text: 'Суралцахуйн үр дүнгүүд', colSpan: 3, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        { text: 'Мэдлэг', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Чадвар', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Хандлага', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {}
      ],
      ...data.cloList.filter((row: { type: string; }) => row.type === 'LAB').map((row: { order: any; cloName: any; knowledge: boolean; skill: boolean; attitude: boolean; }, index: any) => [
        {
          text: row.order,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.cloName,
          alignment: 'left',
          colSpan: 3,
          style: 'tableData'
        },
        {},
        {},
        {
          text: row.knowledge == true ? 'true' : 'false',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.skill == true ? 'true' : 'false',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.attitude == true ? 'true' : 'false',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {}
      ]),
      // -------------------- Zasvar ----------------------
      [
        { text: 'СУРГАХ, СУРАЛЦАХ АРГА ЗҮЙ (Teaching and Learning Method)', colSpan: 10, alignment: 'left', style: 'tableData' },
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
        { text: 'Хичээлийн хэлбэр', colSpan: 2, rowSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'Сургалтын арга зүй', colSpan: 3, rowSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        { text: 'Сургалтын хэлбэр', colSpan: 3, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        { text: 'CLOs\nхамаарал', colSpan: 2, rowSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
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
        {}
      ],

      ...data.method.map((row: {
        cloRelevance: any; classroom: boolean; electronic: boolean; combined: boolean; pedagogy: string; deliveryMode: any; title: any; time: any;
}, index: any) => [
        {
          text: (pedagogyOptions.find(e => e.value === row.pedagogy)?.label) || '',
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: (deliveryModes.find(e => e.value === row.deliveryMode)?.label) || '',
          colSpan: 3,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {},
        {
          text: row.classroom == true ? 'True' : 'false',
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.electronic == true ? 'True' : 'false',
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.combined == true ? 'True' : 'false',
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.cloRelevance.map((item: any) => item.cloName).join(', '),
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {}
      ]),
      [
        { text: 'ХИЧЭЭЛИЙН ҮНЭЛГЭЭ (Course assessment)', colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        { text: 'д/д', rowSpan: 3, alignment: 'center', style: 'tableHeader' },
        { text: 'Суралцахуйн үр дүнгүүд', colSpan: 3, rowSpan: 3, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        { text: 'Үнэлгээнийй аргууд', colSpan: 6, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        {},
        {},
        {}
      ],
      [
        {},
        {},
        {},
        {},
        { text: 'Ирц/Хичээлд\nоролцсон\nбайдал', alignment: 'left', style: 'tableData' },
        { text: 'Даалгавар/\nБие даалт', alignment: 'left', style: 'tableData' },
        { text: 'Явцын\nшалгалт/\nСорил', alignment: 'left', style: 'tableData' },
        { text: 'Курсын\nажил/төсөл', alignment: 'left', style: 'tableData' },
        { text: 'Лабораторийн\nажил', alignment: 'left', style: 'tableData' },
        { text: 'Улирлын шалгалт\n(30 оноо)', rowSpan: 2, alignment: 'left', style: 'tableData' }
      ],
      [
        {},
        {},
        {},
        {},
        { text: 'Явцын үнэлгээ (70 оноо)', colSpan: 5, alignment: 'left', style: 'tableData' },
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { text: 'Лекц, семинарын хичээлийн суралцахуйн үр дүнгүүд:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
      ...data.assessment
        .filter((row: { clo: { type: any; }; }) => row.clo.type === 'LEC_SEM').map((row: { clo: { cloName: any; }; attendance: boolean; assignment: boolean; quiz: boolean; project: boolean; lab: boolean; exam: boolean; }, index: number) => [
          {
            text: index + 1,
            alignment: 'center',
            style: 'tableData'

          },
          {
            text: row.clo.cloName,
            colSpan: 3,
            alignment: 'center',
            style: 'tableData'

          },
          {},
          {},
          {
            text: row.attendance == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.assignment == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.quiz == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.project == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.lab == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.exam == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          }
        ]),
      [
        { text: 'Лаборатори/практикийн хичээлийн суралцахуйн үр дүнгүүд:', colSpan: 10, alignment: 'left', style: 'tableHeader' },
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
      ...data.assessment
        .filter((row: { clo: { type: any; }; }) => row.clo.type === 'LAB').map((row: { clo: { cloName: any; }; attendance: boolean; assignment: boolean; quiz: boolean; project: boolean; lab: boolean; exam: boolean; }, index: number) => [
          {
            text: index + 1,
            alignment: 'center',
            style: 'tableData'

          },
          {
            text: row.clo.cloName,
            colSpan: 3,
            alignment: 'center',
            style: 'tableData'

          },
          {},
          {},
          {
            text: row.attendance == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.assignment == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.quiz == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.project == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.lab == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          },
          {
            text: row.exam == true ? 'True' : 'False',
            alignment: 'center',
            style: 'tableData'
          }
        ]),
      [
        { text: ' ', colSpan: 10, alignment: 'left', style: 'tableData' },
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
        { text: data.assessFooter[0].name, colSpan: 4, alignment: 'center', style: 'tableData' },
        {},
        {},
        {},
        { text: data.assessFooter[0].attendanceValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[0].assignmentValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[0].quizValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[0].projectValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[0].labValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[0].examValue, alignment: 'center', style: 'tableData' }
      ],
      [
        { text: data.assessFooter[1].name, colSpan: 4, alignment: 'center', style: 'tableData' },
        {},
        {},
        {},
        { text: data.assessFooter[1].attendanceValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[1].assignmentValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[1].quizValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[1].projectValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[1].labValue, alignment: 'center', style: 'tableData' },
        { text: data.assessFooter[1].examValue, alignment: 'center', style: 'tableData' }
      ],
      [
        { text: 'ХИЧЭЭЛД ТАВИГДАХ НЭМЭЛТ ШААРДЛАГУУД:', colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        {
          ul: data.additional.additional.map((row: { [x: string]: any; }, index: number) => `${row}`),
          colSpan: 10,
          style: 'tableData'
        },
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
        { text: 'БАТАЛГААЖУУЛАЛТ:', colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        { text: 'Боловсруулсан багш:\n/Ж.Алимаа/', colSpan: 3, alignment: 'left', style: 'tableData' },
        {},
        {},
        { text: 'Гарын үсэг', colSpan: 3, alignment: 'left', style: 'tableData' },
        {},
        {},
        { text: 'Огноо: 2023.06.07', colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Боловсруулсан багш:\n/А.Хүдэр/', colSpan: 3, alignment: 'left', style: 'tableData' },
        {},
        {},
        { text: 'Гарын үсэг', colSpan: 3, alignment: 'left', style: 'tableData' },
        {},
        {},
        { text: 'Огноо: 2023.06.07', colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ]
    ];

    const documentDefinition = {
      content: [
        // { text: 'PDF Title', style: 'header' },
        // { text: 'This is a sample PDF generated using pdfMake in Angular.', style: 'body' },
        {
          table: {
            // headerRows: 1,
            widths: ['10%', '10%', '16%', '16%', '8%', '8%', '8%', '8%', '8%', '8%'],
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
