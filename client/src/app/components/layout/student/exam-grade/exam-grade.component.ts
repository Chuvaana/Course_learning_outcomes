import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { lessonAssessmentService } from '../../../../services/lessonAssessment';
import { CLOService } from '../../../../services/cloService';
interface assessmentList {
  examType: any;
  lessonId: string;
  studentId: string;
  lastName: string;
  firstName: string;
  status: string;
  gmail: string;
  question: any[];
}

@Component({
  selector: 'app-exam-grade',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, DialogModule],
  templateUrl: './exam-grade.component.html',
  styleUrls: ['./exam-grade.component.scss'],
})
export class ExamGradeComponent {
  lessonId: any;
  examList: assessmentList[] = [];
  question: any[] = [];
  allPoint = '';
  takePoint = '';
  questionNumber = 0;
  durationDate = '';
  startDate = '';
  dialogHeader = '';
  cloList: any;

  constructor(
    private route: ActivatedRoute,
    private service: CLOService,
    private lessonAssessmentService: lessonAssessmentService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.service.getCloList(this.lessonId).subscribe((data: any) => {
      this.cloList = data;
    });

    this.selectlessonAssessment();
  }

  selectlessonAssessment() {
    const studentCode = localStorage.getItem('studentCode') || '';
    this.lessonAssessmentService
      .getLesAssessmentByStudent(this.lessonId, studentCode.toLowerCase())
      .subscribe((res) => {
        this.examList = res;
      });
  }
  visible: boolean = false;

  showDialog(e: any) {
    this.durationDate = e.durationDate;
    this.startDate = e.startDate;
    this.questionNumber = e.question.length;
    this.question = e.question;
    this.dialogHeader = `${e.examTypeName} дэлгэрэнгүй`;
    // let allp = 0;
    // let takep = 0;

    // this.question.map((que: any) => {
    //   allp += Number(que.allPoint);
    //   takep += Number(que.takePoint || 0);
    // });
    // this.allPoint = allp.toFixed(2);
    // this.takePoint = takep.toFixed(2);
    this.allPoint = e.allPoint;
    this.takePoint = e.takePoint;
    this.visible = true;
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }
}
