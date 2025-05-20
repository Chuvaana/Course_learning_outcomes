import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../services/cloPointPlanService';
import { CLOService } from '../../../../services/cloService';
import { CurriculumService } from '../../../../services/curriculum.service';
import { StudentService } from '../../../../services/studentService';
import { TeacherService } from '../../../../services/teacherService';
import { LessonAssessmentComponent } from './lesson-assessment/lesson-assessment.component';
import { LessonCloComponent } from './lesson-clo/lesson-clo.component';
import { LessonDirectIndirectComponent } from './lesson-direct-indirect/lesson-direct-indirect.component';
import { LessonIndirectAssessComponent } from './lesson-indirect-assess/lesson-indirect-assess.component';
import { LessonInfoComponent } from './lesson-info/lesson-info.component';
import { LessonOverallAssessComponent } from './lesson-overall-assess/lesson-overall-assess.component';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { LessonPollAnalysisComponent } from './lesson-poll-analysis/lesson-poll-analysis.component';
import { LessonAdvDisadvComponent } from './lesson-adv-disadv/lesson-adv-disadv.component';
import { PdfMainService } from '../../../../services/pdf-main.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssessProcessService } from './lesson-assessment/assessProcess';
import { ConfigService } from '../../../../services/configService';
import { ChartModule } from 'primeng/chart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProgressSpinner,
    CommonModule,
    TabsModule,
    ButtonModule,
    LessonInfoComponent,
    LessonCloComponent,
    LessonPlanComponent,
    LessonAssessmentComponent,
    LessonOverallAssessComponent,
    LessonIndirectAssessComponent,
    LessonDirectIndirectComponent,
    LessonPollAnalysisComponent,
    LessonAdvDisadvComponent,
    ChartModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  lessonId!: string;
  teacherId!: string;
  cloPoint: any;
  cloPoints: any;
  averagePercentages: any;
  feedBack: any;
  feedBackTast: any;

  ratingLevels = [
    { key: 'score5', label: 'Маш сайн (5)' },
    { key: 'score4', label: 'Сайн (4)' },
    { key: 'score3', label: 'Дунд (3)' },
    { key: 'score2', label: 'Муу (2)' },
    { key: 'score1', label: 'Маш муу (1)' },
  ];
  // үндсэн мэдээлэл
  pdfSendData: any[] = [];
  mainInfo = [];
  studentCount!: number;

  // суралцахуйн үр дүн
  clos = [];

  // төлөвлөгөө
  cloList: any[] = [];
  assessPlan: any;
  cloPlan = [];
  cloForm!: FormGroup;
  tabs: any;
  pollData: any;
  cloPlans: any;
  pollDatas: any;
  assessPlans: any;
  cloLists: any;
  lesStudent: any;
  teacherName: any;
  summaryData: any;
  countCheck = 0;
  season!: string;
  chartData: any;
  chartOptions: any;
  chartDataAssess: any;
  chartOptionAssess: any;
  activeImage = false;
  sentImage1: any[] = [];
  isLoading: boolean = false;


  // clo дүн
  tabDatas!: [{ title: string; content: any; value: any }];
  students!: any;

  types = [
    { label: 'Лекц', value: 'ALEC' },
    { label: 'Семинар', value: 'BSEM' },
    { label: 'Лаборатори', value: 'CLAB' },
  ];

  @ViewChild('chartWrapper') chartWrapper!: ElementRef;
  @ViewChild('chartDataWrapper') chartDataWrapper!: ElementRef;
  constructor(
    private cdr: ChangeDetectorRef,
    private assessProcess: AssessProcessService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private service: CurriculumService,
    private confService: ConfigService,
    private cloService: CLOService,
    private assessService: AssessmentService,
    private pdfMainService: PdfMainService,
    private cloPointPlanService: CloPointPlanService
  ) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.teacherId = (localStorage.getItem('teacherId') as string) || '';
    this.readMainInfo();
    this.readClos();
    this.readPlan();
  }

  readMainInfo() {
    this.service.getMainInfo(this.lessonId).subscribe((response: any) => {
      if (response) {
        this.mainInfo = response;
        this.teacherName = response.teacher.name;
      }
    });

    this.studentService.getStudents(this.lessonId).subscribe((res) => {
      this.students = res;
      this.studentCount = res.length;
    });
  }

  readClos() {
    this.cloService.getCloList(this.lessonId).subscribe((data: any) => {
      this.clos = data.map((item: any) => {
        const typeLabel = this.types.find(
          (type) => type.value === item.type
        )?.label;

        return {
          id: item.id,
          type: typeLabel,
          cloName: item.cloName,
          knowledge: item.knowledge || false,
          skill: item.skill || false,
          attitude: item.attitude || false,
        };
      });
    });
  }

  readPlan() {
    forkJoin([
      this.teacherService.getCloList(this.lessonId),
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
      this.service.getPollQuesLesson(this.lessonId),
      this.confService.getConfig('season'),
    ]).subscribe(([cloList, cloPlan, assessPlan, pollData, conf]) => {
      this.season = conf;
      this.cloList = cloList;
      this.assessPlan = assessPlan;
      this.cloPlan = cloPlan;
      this.pollDatas = pollData;
      this.pdfToConvert();
    });
  }
  createRows(cloList: any, cloPlan: any) {
    this.cloPoint = [];

    const cloRows = cloList.map((item: any) => {
      const procPointsArray = this.fb.array<FormGroup>([]);
      const examPointsArray = this.fb.array<FormGroup>([]);

      cloPlan.forEach((plan: any) => {
        plan.subMethods.forEach((sub: any) => {
          const pointGroup = this.fb.group({
            subMethodId: sub._id,
            point: [0],
          });

          if (plan.methodType !== 'EXAM') {
            procPointsArray.push(pointGroup);
          } else if (plan.methodType === 'EXAM') {
            examPointsArray.push(pointGroup);
          }
        });
      });

      this.cloPoint.push({
        lessonId: this.lessonId,
        cloId: item.id,
        cloName: item.cloName,
        cloType: item.type,
        procPoints: procPointsArray.value,
        examPoints: examPointsArray.value,
      });

      return this.fb.group({
        cloId: item.id,
        lessonId: this.lessonId,
        cloType: item.type,
        procPoints: procPointsArray,
        examPoints: examPointsArray,
      });
    });

    this.cloForm = this.fb.group({
      cloRows: this.fb.array(cloRows),
    });
  }

  pdfToConvert() {
    this.pdfSendData = [];
    forkJoin([
      this.service.getCloList(this.lessonId),
      this.service.getPollQuesLesson(this.lessonId),
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
      this.service.getLessonByStudent(this.lessonId),
      this.service.getFeedBackTask(this.lessonId),
      this.service.getFeedBack(this.lessonId),
    ]).subscribe(
      ([
        cloList,
        pollData,
        cloPlan,
        assessPlan,
        lesStudent,
        feedBackTast,
        feedBack,
      ]) => {
        this.cloLists = cloList;
        this.assessPlans = assessPlan;
        this.pollDatas = pollData;
        this.lesStudent = lesStudent;
        this.feedBackTast = feedBackTast;
        this.feedBack = feedBack;
        // this.pdfSendData.push(this.assessPlans);
        this.cloPoints = this.cloPlan.map((clo: any) => ({
          ...clo,
          cloName:
            this.cloLists.find((c: any) => (c.id || c._id) === clo.cloId)
              ?.cloName ?? '-',
        }));
        // this.pdfSendData.push(this.cloPoints);
        this.cloPlans = cloPlan;
        if (Array.isArray(this.cloPlans) && this.cloPlans.length === 0) {
          this.createRows(this.cloLists, this.assessPlans.plans);
        }
        this.tabs = this.cloLists.map((item: any, index: number) => ({
          id: item.id,
          title: item.cloName,
          content: [],
          assessPlan: [],
          totalPoint: 0,
          value: index,
        }));
        this.countCheck = 0;
        this.read();

        if (this.assessPlans.plans && this.tabs.length) {
          const assessPlanMap = new Map();
          this.cloPlans.forEach((plan: any) => {
            const assessPlan = [...plan.examPoints, ...plan.procPoints].filter(
              (ePoint) => ePoint.point !== 0
            );
            assessPlanMap.set(plan.cloId, assessPlan);
          });

          this.tabs.forEach((item: any) => {
            const assessPlan = assessPlanMap.get(item.id) || [];
            item.assessPlan = assessPlan.map(
              (col: { subMethodId: string }) => ({
                ...col,
                subMethodName: this.getSubMethodName(col.subMethodId), // Precompute the name
              })
            );
            item.totalPoint = assessPlan.reduce(
              (acc: any, curr: { point: any }) => acc + (curr.point || 0),
              0
            );
          });

          if (this.students) {
            this.tabs.forEach((item: any) => {
              item.content = this.students.map((stu: any) => {
                const points = item.assessPlan.map((plan: any) => ({
                  subMethodId: plan.subMethodId,
                  point: 0,
                }));

                return {
                  studentId: stu.id,
                  studentCode: stu.studentCode,
                  studentName: stu.studentName,
                  points,
                  totalPoint: 0,
                  percentage: 0,
                  letterGrade: '',
                };
              });
            });
          }
        }
      }
    );
  }
  pdfTo() {
    this.pdfSendData = [];
    const assessPlans = this.assessPlan;
    const cloLength = assessPlans.plans.length - 1;
    if (assessPlans.plans[cloLength].methodType !== 'EXAM') {
      const [row] = assessPlans.plans.splice(cloLength - 1, 1); // Олдсон мөрийг салгаж авна
      assessPlans.plans.push(row);
    }
    this.pdfSendData.push(assessPlans);
    this.pdfSendData.push(this.cloPoints);
    this.pdfSendData.push(this.tabs);
    this.pdfSendData.push(this.pollDatas);
    this.pdfSendData.push(this.mainInfo);
    this.pdfSendData.push(this.lesStudent);
    this.pdfSendData.push(this.cloList);

    let cloData: any;
    cloData = this.pollDatas.flatMap((item: any) =>
      item.groupList
        .filter((qe: any) => qe.groupType === 'CLO')
        .flatMap((qe: any) => qe.questionList || [])
    );

    const stats = this.calculateCloStats(cloData);

    const percentValues: { [key: string]: number } = {};
    const gradeValues: { [key: string]: string } = {};

    stats.forEach((item) => {
      percentValues[item.clo] = item.highScorePercent;
      gradeValues[item.clo] = item.letter;
    });

    this.summaryData = [
      {
        label: 'Шууд бус үнэлгээний дундаж хувь',
        values: percentValues,
        type: 'percent',
      },
      {
        label: 'Шалгуур хангасан байдал',
        values: gradeValues,
        type: 'grade',
      },
    ];
    this.averagePercentages = this.getCloAveragePercentages();

    const percentValues1: { [key: string]: number } = {};
    const gradeValues1: { [key: string]: string } = {};

    this.averagePercentages.forEach((item: any) => {
      percentValues1[item.clo] = item.percentage;
      gradeValues1[item.clo] = item.letter;
    });
    this.summaryData.push(
      {
        label: 'Шууд үнэлгээний дундаж хувь',
        values: percentValues1,
        type: 'percent',
      },
      {
        label: 'Шалгуур хангасан байдал',
        values: gradeValues1,
        type: 'grade',
      }
    );
    this.pdfSendData.push(this.summaryData);
    this.pdfSendData.push(this.feedBackTast);
    this.pdfSendData.push(this.feedBack);
    this.pdfSendData.push(this.season);
    this.pdfSendData.push(this.sentImage1);
    this.pdfMainService.generatePdfAll(this.pdfSendData);
  }

  calculateCloStats(data: any[]) {
    const grouped: { [cloId: string]: any[] } = {};

    data.forEach((entry) => {
      if (!grouped[entry.cloId]) grouped[entry.cloId] = [];
      grouped[entry.cloId].push(entry);
    });

    const result = Object.entries(grouped).map(([cloId, responses]) => {
      const scores = { score5: 0, score4: 0, score3: 0, score2: 0, score1: 0 };
      let highScoreCount = 0;

      responses.forEach((entry: any) => {
        const value = Number(entry.answerValue);
        if (value >= 1 && value <= 5) {
          scores[`score${value}` as keyof typeof scores]++;
          if (value >= 4) highScoreCount++;
        }
      });

      const total = responses.length;

      return {
        clo: cloId,
        highScorePercent: Math.round((highScoreCount / total) * 100),
        letter: this.getLetterGrade(Math.round((highScoreCount / total) * 100)),
      };
    });

    return result;
  }

  getSubMethodName(e: string): string {
    let name = '';
    this.assessPlan.plans.map((pl: any) => {
      pl.subMethods.map((sub: any) => {
        if (sub._id === e) {
          name = sub.subMethod;
        }
      });
    });
    return name;
  }

  activeBtn() {
    if (this.countCheck === 4) {
      let cloData = this.pollDatas.flatMap((item: any) =>
        item.groupList
          .filter((qe: any) => qe.groupType === 'CLO')
          .flatMap((qe: any) => qe.questionList || [])
      );
      const stats = this.calculateCloStatsChart(cloData);
      this.prepareChartData();
      this.generateChartData(stats);
      // this.pdfTo();
    }
  }
  read() {
    this.assessProcess.gradePoint(this.lessonId).subscribe((gradeData) => {
      this.tabs.forEach((item: any) => {
        gradeData.map((grades: any) => {
          if (item.id === grades.cloId) {
            item.content.forEach((studentRow: any) => {
              let total = 0;

              studentRow.points.forEach((pointItem: any) => {
                const grade = grades.sumPoints.find(
                  (g: any) =>
                    g.studentId === studentRow.studentId &&
                    g.subMethodId === pointItem.subMethodId
                );

                if (grade) {
                  pointItem.point = grade.point;
                  total += grade.point;
                }
              });

              studentRow.totalPoint += total;

              studentRow.percentage =
                (studentRow.totalPoint / item.totalPoint) * 100;

              studentRow.letterGrade = this.getLetterGrade(
                studentRow.percentage
              );
            });
          }
        });
      });
      this.countCheck = this.countCheck + 1;
      this.activeBtn();
    });

    this.assessProcess
      .studentAttPoint(
        this.lessonId,
        this.cloList,
        this.assessPlans,
        this.cloPlan
      )
      .subscribe((data) => {
        const pointMap = new Map<string, Map<string, number>>();

        data.forEach((attendance: any) => {
          const key = `${attendance.cloId}_${attendance.subMethodId}`; // Composite key
          if (!pointMap.has(key)) {
            pointMap.set(key, new Map());
          }

          attendance.sumPoints.forEach((sp: any) => {
            const floatPoint = Number(parseFloat(sp.statusPoint));
            pointMap.get(key)!.set(sp.studentId, floatPoint);
          });
        });

        // Update studentRow.points with values from pointMap
        this.tabs.forEach((tab: any) => {
          tab.content.forEach((studentRow: any) => {
            let total = 0;
            studentRow.points.forEach((point: any) => {
              const key = `${tab.id}_${point.subMethodId}`;
              const studentPoints = pointMap.get(key);
              if (studentPoints && studentPoints.has(studentRow.studentId)) {
                point.point = studentPoints.get(studentRow.studentId);
                total += studentPoints.get(studentRow.studentId) || 0;
              }
            });
            studentRow.totalPoint += total;
            studentRow.percentage =
              (studentRow.totalPoint / tab.totalPoint) * 100;
            studentRow.letterGrade = this.getLetterGrade(studentRow.percentage);
          });
        });
        this.countCheck = this.countCheck + 1;
        this.activeBtn();
      });

    this.assessProcess
      .studentActivityPoint(this.lessonId, this.assessPlans, this.cloPlan)
      .subscribe((data) => {
        const pointMap = new Map<string, Map<string, number>>();

        data.forEach((activity: any) => {
          const key = `${activity.cloId}_${activity.subMethodId}`; // Composite key
          if (!pointMap.has(key)) {
            pointMap.set(key, new Map());
          }

          activity.sumPoints.forEach((sp: any) => {
            const floatPoint = Number(parseFloat(sp.statusPoint));
            pointMap.get(key)!.set(sp.studentId, floatPoint);
          });
        });

        this.tabs.forEach((tab: any) => {
          tab.content.forEach((studentRow: any) => {
            let total = 0;
            studentRow.points.forEach((point: any) => {
              const key = `${tab.id}_${point.subMethodId}`;
              const studentPoints = pointMap.get(key);
              if (studentPoints && studentPoints.has(studentRow.studentId)) {
                point.point = studentPoints.get(studentRow.studentId);
                total += studentPoints.get(studentRow.studentId) || 0;
              }
            });
            studentRow.totalPoint += total;
            studentRow.percentage =
              (studentRow.totalPoint / tab.totalPoint) * 100;
            studentRow.letterGrade = this.getLetterGrade(studentRow.percentage);
          });
        });
        this.countCheck = this.countCheck + 1;
        this.activeBtn();
      });

    this.assessProcess
      .studentExamPointProcess(this.lessonId, this.cloList)
      .subscribe((data) => {
        this.tabs.forEach((item: any) => {
          data.forEach((grades: any) => {
            if (item.id === grades.cloId) {
              item.content.forEach((studentRow: any) => {
                let total = 0;
                let takeTotal = 0;
                let alltotal = 0;

                studentRow.points.forEach((pointItem: any) => {
                  const grade = grades.sumPoint.find(
                    (g: any) =>
                      g.studentId.toLowerCase() ===
                      studentRow.studentCode.toLowerCase() &&
                      g.subMethodId === pointItem.subMethodId
                  );

                  if (grade) {
                    const plan = item.assessPlan.find(
                      (pla: any) => pla.subMethodId === grade.subMethodId
                    );

                    const point = plan ? plan.point : 0;

                    alltotal += grade.allPoint;
                    takeTotal += grade.totalPoint;
                    pointItem.point = (takeTotal * point) / (alltotal || 1);
                    total += pointItem.point;
                  }
                });

                studentRow.totalPoint += total;
                studentRow.percentage =
                  (studentRow.totalPoint / item.totalPoint) * 100;
                studentRow.letterGrade = this.getLetterGrade(
                  studentRow.percentage
                );
              });
            }
          });
        });
        // this.pdfSendData.push(this.tabs);
        this.countCheck = this.countCheck + 1;
        this.activeBtn();
      });
  }

  getLetterGrade(percent: number): string {
    if (percent > 90) return 'A';
    if (percent > 80) return 'B';
    if (percent > 70) return 'C';
    if (percent > 60) return 'D';
    return 'F';
  }

  getCloAveragePercentages(): {
    clo: string;
    percentage: number;
    letter: string;
  }[] {
    return this.tabs.map((tab: { content: never[]; id: any }) => {
      const students = tab.content || [];
      const totalPercent = students.reduce((sum: number, student: any) => {
        return sum + (student.percentage || 0);
      }, 0);
      const average = students.length ? totalPercent / students.length : 0;
      const rounded = +average.toFixed(2);
      return {
        clo: tab.id,
        percentage: rounded,
        letter: this.getLetterGrade(rounded),
      };
    });
  }

  prepareChartData() {
    const labels = this.tabs.map((tab: any) => tab.title);
    const totalStudents = this.tabs.map((tab: any) => this.getTotalStudents(tab));
    const aboveCCount = this.tabs.map((tab: any) => this.getAboveCCount(tab));
    const aboveCPercentage = this.tabs.map(
      (tab: any) => +this.getAboveCPercentage(tab)
    );

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Нийт үнэлэгдсэн оюутны тоо',
          backgroundColor: '#42A5F5',
          data: totalStudents,
        },
        {
          label: 'C ба түүнээс дээш үнэлгээтэй оюутны тоо',
          backgroundColor: '#66BB6A',
          data: aboveCCount,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Оюутны үнэлгээний харьцуулалт',
        },
      },
    };
  }

  generateChartData(stats: any[]) {
    const labels = stats.map((s) => this.getCloName(s.clo));
    const datasets = this.ratingLevels.map((level: any) => ({
      label: level.label,
      backgroundColor: this.getColorByScore(level.key),
      data: stats.map((s) => s.percentages[level.key]),
    }));

    this.chartDataAssess = {
      labels,
      datasets,
    };

    this.chartOptionAssess = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'CLO үнэлгээний түвшний тойм',
        },
      },
    };
  }

  getColorByScore(scoreKey: string): string {
    const colors: any = {
      score5: '#4caf50',
      score4: '#8bc34a',
      score3: '#ffeb3b',
      score2: '#ff9800',
      score1: '#f44336',
    };
    return colors[scoreKey] || '#9e9e9e';
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getAboveCCount(tab: any): number {
    return tab.content.filter((s: any) =>
      ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'].includes(s.letterGrade)
    ).length;
  }

  getGradeCount(tab: any, grades: string[]): number {
    return tab.content.filter((s: any) => grades.includes(s.letterGrade))
      .length;
  }

  getAboveCPercentage(tab: any): string {
    const total = this.getTotalStudents(tab);
    if (total === 0) return '0.00';
    const aboveC = this.getAboveCCount(tab);
    return ((aboveC / total) * 100).toFixed(2);
  }

  getTotalStudents(tab: any): number {
    return tab.content.filter(
      (s: any) => s.letterGrade && s.letterGrade !== '-'
    ).length;
  }

  exportPDF() {
    this.sentImage1 = [];
    this.activeImage = true;
    this.isLoading = true; // Спиннерийг асаана

    this.cdr.detectChanges();

    setTimeout(() => {
      html2canvas(this.chartWrapper.nativeElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
        this.sentImage1.push(imgData);

        html2canvas(this.chartDataWrapper.nativeElement).then((canvas) => {
          const imgData1 = canvas.toDataURL('image/png');
          const pdf1 = new jsPDF('p', 'mm', 'a4');
          const pdfWidth1 = pdf1.internal.pageSize.getWidth();
          const pdfHeight1 = (canvas.height * pdfWidth1) / canvas.width;

          pdf1.addImage(imgData1, 'PNG', 0, 10, pdfWidth1, pdfHeight1);
          this.sentImage1.push(imgData1);

          this.activeImage = false;
          this.isLoading = false; // Спиннерийг унтраана
          this.cdr.detectChanges();
          this.pdfTo();
        });
      });
    }, 1000);
  }

  calculateCloStatsChart(data: any[]) {
    const grouped: { [cloId: string]: any[] } = {};

    // Group by cloId
    data.forEach((entry) => {
      if (!grouped[entry.cloId]) grouped[entry.cloId] = [];
      grouped[entry.cloId].push(entry);
    });

    const result = Object.entries(grouped).map(([cloId, responses]) => {
      const scores = { score5: 0, score4: 0, score3: 0, score2: 0, score1: 0 };
      let highScoreCount = 0;

      responses.forEach((entry: any) => {
        const value = Number(entry.answerValue);
        if (value >= 1 && value <= 5) {
          scores[`score${value}` as keyof typeof scores]++;
          if (value >= 4) highScoreCount++;
        }
      });

      const total = responses.length;
      const percentages = {
        score5: Math.round((scores.score5 / total) * 100),
        score4: Math.round((scores.score4 / total) * 100),
        score3: Math.round((scores.score3 / total) * 100),
        score2: Math.round((scores.score2 / total) * 100),
        score1: Math.round((scores.score1 / total) * 100),
      };

      return {
        clo: cloId,
        responses: scores,
        percentages,
        total,
        highScoreCount,
        highScorePercent: Math.round((highScoreCount / total) * 100),
      };
    });

    return result;
  }
}
