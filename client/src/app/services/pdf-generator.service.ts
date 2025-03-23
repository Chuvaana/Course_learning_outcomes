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
  generatePdfTest(data: any[][]) {
    const dataType = [
      {
        name: 'asdfasdfa',
        type: 'asdfasdfa',
      },
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
      // {
      //   order: 4,
      //   detail: 'zxczxczx',
      // },
      // {
      //   order: 5,
      //   detail: 'zxczxczx',
      // },
    ];
    const cloDetail = [
      {
        order: 1,
        title: 'Алгоритм ойлгох, хэрэглэх',
        knowledgeLvl: '☐',
        abilityLvl: '☐',
        attitudeLvl: '☐',
        cloLessonType: 'LEKTS',
      },
      {
        order: 2,
        title: 'Программчлалын энгийн бодлогуудыг шийдвэрлэх',
        knowledgeLvl: '☑',
        abilityLvl: '☑',
        attitudeLvl: '☑',
        cloLessonType: 'LEKTS',
      },
      {
        order: 3,
        title: 'Блок схем загварчлах',
        knowledgeLvl: '☑',
        abilityLvl: '☐',
        attitudeLvl: '☑',
        cloLessonType: 'LAB',
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
    const lessonDetailWeak = [
      {
        order: 1,
        orderRomb: 'I',
        lessonDetailWeakId: 1,
        lessonCode: 'CF-101',
        lessonName: 'Програмчлалын үндэс',
        title: 'Компьютерийн системийн удиртгал-1',
        lektsTime: '2',
        labTime: '2',
      },
      {
        order: 2,
        orderRomb: 'II',
        lessonDetailWeakId: 2,
        lessonCode: 'CF-101',
        lessonName: 'Програмчлалын үндэс',
        title: 'Блок схем түүнийг дүрслэх, хэрэглэх',
        lektsTime: '2',
        labTime: '2',
      },
      {
        order: 3,
        orderRomb: 'III',
        lessonDetailWeakId: 3,
        lessonCode: 'CF-101',
        lessonName: 'Програмчлалын үндэс',
        title: 'Компьютерийн удиртгал - 2 ',
        lektsTime: '2',
        labTime: '2',
      },
      {
        order: 4,
        orderRomb: 'IV',
        lessonDetailWeakId: 4,
        lessonCode: 'CF-101',
        lessonName: 'Програмчлалын үндэс',
        title: 'Программын удирдлага',
        lektsTime: '2',
        labTime: '2',
      },
      {
        order: 5,
        orderRomb: 'V',
        lessonDetailWeakId: 5,
        lessonCode: 'CF-101',
        lessonName: 'Програмчлалын үндэс',
        title: 'Бүтцээр Си програм хөгжүүлэх ',
        lektsTime: '2',
        labTime: '2',
      },
      // {
      //   order: 6,
      //   orderRomb: 'VI',
      //   lessonDetailWeakId: 5,
      //   lessonCode: 'CF-101',
      //   lessonName: 'Програмчлалын үндэс',
      //   title: 'Бүтцээр Си програм хөгжүүлэх ',
      //   lektsTime: '2',
      //   labTime: '2',
      // },
    ];
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
        { text: 'Програмчлалын үндэс', colSpan: 8, alignment: 'left', style: 'tableData' },
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
        { text: 'S.CFM100', colSpan: 2, alignment: 'left', style: 'colorTable' },
        {},
        { text: 'Хичээлийн кредит:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: '3', colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Салбар/Тэнхим:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'Компьютерын ухаан', colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Сургууль:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'МХТС', colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Үндсэн багшийн нэр:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'Ж.Алимаа', colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Өрөөний дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: '304', colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'E-мэйл хаяг:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'alimaa@must.edu.mn', colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Утасны дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: '70159111', colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'Туслах багшийн нэр:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: ' ', colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Өрөөний дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: ' ', colSpan: 4, alignment: 'left', style: 'tableData' },
        {},
        {},
        {}
      ],
      [
        { text: 'E-мэйл хаяг:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'alimaa@must.edu.mn', colSpan: 2, alignment: 'left', style: 'tableData' },
        {},
        { text: 'Утасны дугаар:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: '70159111', colSpan: 4, alignment: 'left', style: 'tableData' },
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
        { text: 'Лаборатори', colSpan: 2,alignment: 'center', style: 'tableData' },
        {},
        { text: 'Бие даалт', colSpan: 2,alignment: 'center', style: 'tableData' },
        {},
        { text: 'Практик',colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        {},
        {},
        { text: '1', alignment: 'center', style: 'tableData' },
        { text: '0', alignment: 'center', style: 'tableData' },
        { text: '2',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: '4',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: '0',colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Нийт танхимын цаг:', colSpan: 2, rowSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: 'Лекц', alignment: 'center', style: 'tableData' },
        { text: 'Семинар', alignment: 'center', style: 'tableData' },
        { text: 'Лаборатори',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Бие даалт',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Практик',colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        {},
        {},
        { text: '32', alignment: 'center', style: 'tableData' },
        { text: '0', alignment: 'center', style: 'tableData' },
        { text: '32',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: '16',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: ' ',colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Бие даан суралцах цаг:', colSpan: 2, alignment: 'left', style: 'tableHeader' },
        {},
        { text: '16', alignment: 'center', style: 'tableData' },
        { text: '32', alignment: 'center', style: 'tableData' },
        { text: '32',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: '80',colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: ' ',colSpan: 2, alignment: 'center', style: 'tableData' },
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
          ul: dataType.map((row) => row.type),
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
          ul: dataType.map((row) => row.type),
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
          ul: dataType.map((row) => row.type),
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
          ul: dataType.map((row) => row.type),
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
          ul: dataType.map((row) => row.type),
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
        { text: 'Цаг',colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...lessonDetailWeak.map((row, index) => [
        {
          text: row.orderRomb,
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
          text: row.labTime,
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
        { text: 'Цаг',colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...lessonDetailWeak.map((row, index) => [
        {
          text: row.orderRomb,
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
          text: row.labTime,
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
        { text: 'Цаг',colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...lessonDetailWeak.map((row, index) => [
        {
          text: row.orderRomb,
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
          text: row.labTime,
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
        { text: 'Танхимд зөвлөгөө авах, үнэлүүлэх цаг',colSpan: 2, alignment: 'center', style: 'tableHeader' },
        {},
        { text: 'Бие даан суралцах цаг', colSpan: 2,alignment: 'center', style: 'tableHeader' },
        {}
      ],
      ...lessonDetailWeak.map((row, index) => [
        {
          text: row.orderRomb,
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
          text: row.lektsTime,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.labTime,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {}
      ]),
      [
        { text: [
          { text: 'ХИЧЭЭЛИЙН СУРАЛЦАХУЙН ҮР ДҮНГҮҮД (Course Learning Outcomes)\n' },
          { text: 'Оюутан энэ хичээлийг амжилттай судалж дууссанаар дараах мэдлэг, чадвар, хандлагыг эзэмшсэн байна', bold: false }
        ], colSpan: 10, alignment: 'left', style: 'tableTitle' },
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
        { text: 'Мэдлэг', colSpan: 2,alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Чадвар', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Хандлага', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {}
      ],
      ...cloDetail.map((row, index) => [
        {
          text: row.order,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          alignment: 'left',
          colSpan: 3,
          style: 'tableData'
        },
        {},
        {},
        {
          text: row.knowledgeLvl,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.abilityLvl,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.attitudeLvl,
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
      // -------------------- Zasvar ----------------------

      [
        { text: 'д/д', alignment: 'center', style: 'tableHeader' },
        { text: 'Суралцахуйн үр дүнгүүд', colSpan: 3, alignment: 'center', style: 'tableHeader' },
        {},
        {},
        { text: 'Мэдлэг', colSpan: 2,alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Чадвар', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {},
        { text: 'Хандлага', colSpan: 2, alignment: 'center', style: 'colorTable' },
        {}
      ],
      ...cloDetail.map((row, index) => [
        {
          text: row.order,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          alignment: 'left',
          colSpan: 3,
          style: 'tableData'
        },
        {},
        {},
        {
          text: row.knowledgeLvl,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.abilityLvl,
          colSpan: 2,
          alignment: 'center',
          style: 'tableData'
        },
        {},
        {
          text: row.attitudeLvl,
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
      [
        { text: 'Лекц', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Тонгоруу анги', colSpan: 3, alignment: 'center', style: 'tableData' },
        {},
        {},
        { text: '☒', alignment: 'center', style: 'tableData' },
        { text: '☐', alignment: 'center', style: 'tableData' },
        { text: '☐', alignment: 'center', style: 'tableData' },
        { text: '7,8', colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Хэлэлцүүлэг,\nсеминар', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Төсөлд суурилсан сургалт', colSpan: 3, alignment: 'center', style: 'tableData' },
        {},
        {},
        { text: '☒', alignment: 'center', style: 'tableData' },
        { text: '☐', alignment: 'center', style: 'tableData' },
        { text: '☐', alignment: 'center', style: 'tableData' },
        { text: '1,2', colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Лаборатори,\nтуршилт', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Туршилтад суурилсан сургалт', colSpan: 3, alignment: 'center', style: 'tableData' },
        {},
        {},
        { text: '☒', alignment: 'center', style: 'tableData' },
        { text: '☒', alignment: 'center', style: 'tableData' },
        { text: '☐', alignment: 'center', style: 'tableData' },
        { text: '1,2,4', colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
      [
        { text: 'Практик', colSpan: 2, alignment: 'center', style: 'tableData' },
        {},
        { text: 'Асуудалд суурилсан сургалт', colSpan: 3, alignment: 'center', style: 'tableData' },
        {},
        {},
        { text: '☐', alignment: 'center', style: 'tableData' },
        { text: '☐', alignment: 'center', style: 'tableData' },
        { text: '☒', alignment: 'center', style: 'tableData' },
        { text: '5,6', colSpan: 2, alignment: 'center', style: 'tableData' },
        {}
      ],
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
        { text: 'д/д', rowSpan: 3 ,alignment: 'center', style: 'tableHeader' },
        { text: 'Суралцахуйн үр дүнгүүд', colSpan: 3, rowSpan: 3 , alignment: 'center', style: 'tableHeader' },
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
      ...cloTableData
      .filter(row => row.cloLessonType === 'LEKTS').map((row, index) => [
        {
          text: index + 1,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          colSpan: 3,
          alignment: 'center',
          style: 'tableData'

        },
        {},
        {},
        {
          text: row.lessonActive,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.homework,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.progressTest,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.kursProject,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.labWork,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.finalExam,
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
      ...cloTableData
      .filter(row => row.cloLessonType === 'LAB').map((row, index) => [
        {
          text: index+1,
          alignment: 'center',
          style: 'tableData'

        },
        {
          text: row.title,
          colSpan: 3,
          alignment: 'center',
          style: 'tableData'

        },
        {},
        {},
        {
          text: row.lessonActive,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.homework,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.progressTest,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.kursProject,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.labWork,
          alignment: 'center',
          style: 'tableData'
        },
        {
          text: row.finalExam,
          alignment: 'center',
          style: 'tableData'
        }
      ]),
      [
        { text: ' ',colSpan: 10, alignment: 'left', style: 'tableData' },
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
        { text: 'Үнэлгээний эзлэх хувь',colSpan: 4, alignment: 'center', style: 'tableData' },
        {},
        {},
        {},
        { text: '5%', alignment: 'center', style: 'tableData' },
        { text: '10%', alignment: 'center', style: 'tableData' },
        { text: '20%', alignment: 'center', style: 'tableData' },
        { text: '20%', alignment: 'center', style: 'tableData' },
        { text: '15%', alignment: 'center', style: 'tableData' },
        { text: '30%', alignment: 'center', style: 'tableData' }
      ],
      [
        { text: 'Үнэлгээ хийх давтамж',colSpan: 4, alignment: 'center', style: 'tableData' },
        {},
        {},
        {},
        { text: '16', alignment: 'center', style: 'tableData' },
        { text: '3', alignment: 'center', style: 'tableData' },
        { text: '2', alignment: 'center', style: 'tableData' },
        { text: '1', alignment: 'center', style: 'tableData' },
        { text: '3', alignment: 'center', style: 'tableData' },
        { text: '1', alignment: 'center', style: 'tableData' }
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
          ul: lessonAddition.map((row, index) => `${String.fromCharCode(97 + index)}. ${row.detail}`),
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


  generatePdf(data: string[][]) {
    if (data.length === 0) return;

    // Dynamically generate widths based on number of columns
    const documentDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['10%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%'],
            body: data.map((row, rowIndex) =>
              row.map(cell => ({
                text: cell,
                fontSize: 5, // ✅ Set font size here
                alignment: 'center'
              }))
            )
          },
          // layout: {
          //   fillColor: (rowIndex: number) => {
          //     return rowIndex === 0 ? '#CCCCCC' : null; // ✅ Gray background for header row
          //   }
          // }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        },
        body: {
          fontSize: 10,
          margin: [0, 0, 0, 0] as [number, number, number, number] // ✅ Force it to be a tuple
        }
      }
    };

    pdfMake.createPdf(documentDefinition).open(); // ✅ No more TypeScript errors!
  }
}
