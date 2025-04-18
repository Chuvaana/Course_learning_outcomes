import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lesson-assessment',
  imports: [TableModule, ButtonModule, CommonModule, AccordionModule],
  templateUrl: './lesson-assessment.component.html',
  styleUrl: './lesson-assessment.component.scss',
})
export class LessonAssessmentComponent {
  tabs: {
    id: string;
    title: string;
    cloPoint: any;
    assessPlan: any;
    totalPoint: number;
    content: any;
    value: number;
  }[] = [];
  @Input() students: any;
  @Input() cloList: any;
  @Input() pointPlan: any;
  @Input() cloPlan: any;

  ngOnChanges() {
    if (this.cloList?.length && this.tabs.length === 0) {
      this.tabs = this.cloList.map((item: any, index: number) => ({
        id: item.id,
        title: item.cloName,
        content: [],
        assessPlan: [],
        totalPoint: 0,
        value: index,
      }));
    }
    if (this.pointPlan.plans && this.tabs.length) {
      const assessPlanMap = new Map();
      this.cloPlan.forEach((plan: any) => {
        const assessPlan = [...plan.examPoints, ...plan.procPoints].filter(
          (ePoint) => ePoint.point !== 0
        );
        assessPlanMap.set(plan.cloId, assessPlan);
      });

      this.tabs.forEach((item: any) => {
        const assessPlan = assessPlanMap.get(item.id) || [];
        item.assessPlan = assessPlan.map((col: { subMethodId: string }) => ({
          ...col,
          subMethodName: this.getSubMethodName(col.subMethodId), // Precompute the name
        }));
        item.totalPoint = assessPlan.reduce(
          (acc: any, curr: { point: any }) => acc + (curr.point || 0),
          0
        );
      });

      if (this.students) {
        this.tabs.map((item: any) => {
          let content = [];
          this.students.map((stu: any) => {
            content.push({
              studentCode: stu.studentCode,
              studentName: stu.studentName,
              points: item.assessPlan,
            });
            item.content = content;
          });
        });
      }
      console.log(this.tabs);
      console.log(this.students);
      console.log(this.pointPlan);
      console.log(this.cloList);
      console.log(this.cloPlan);
    }
  }

  ngOnInit() {}

  trackById(index: number, item: any): string {
    return item.id; // Assuming 'id' is a unique identifier for each tab
  }

  trackByStudentCode(index: number, item: any): string {
    return item.studentCode; // Assuming 'studentCode' is a unique identifier for each student
  }

  getSubMethodName(e: string): string {
    let name = '';
    this.pointPlan.plans.map((pl: any) => {
      pl.subMethods.map((sub: any) => {
        if (sub._id === e) {
          name = sub.subMethod;
        }
      });
    });
    return name;
  }
}
