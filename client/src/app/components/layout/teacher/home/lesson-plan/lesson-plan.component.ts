import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lesson-plan',
  imports: [CommonModule, TableModule, ProgressSpinnerModule],
  templateUrl: './lesson-plan.component.html',
  styleUrl: './lesson-plan.component.scss',
})
export class LessonPlanComponent implements OnChanges {
  isLoading = false;
  cloRows: any[] = [];
  sampleData: any;

  @Input() cloList: any;
  @Input() pointPlan: any;
  @Input() cloPlan: any;

  ngOnChanges(changes: SimpleChanges) {
    this.proccessedData();
  }

  proccessedData() {
    this.cloRows = []; // clear previous rows
    this.sampleData = [];

    if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
      this.createRows();
    } else {
      this.populateCLOForm();
    }

    this.cloRows = this.cloRows.map((row) => ({
      ...row,
      procTotal:
        (row.timeManagement || 0) +
        (row.engagement || 0) +
        (row.recall || 0) +
        (row.problemSolving || 0) +
        (row.recall2 || 0) +
        (row.problemSolving2 || 0) +
        (row.toExp || 0) +
        (row.processing || 0) +
        (row.decisionMaking || 0) +
        (row.formulation || 0) +
        (row.analysis || 0) +
        (row.implementation || 0),
      examTotal:
        (row.understandingLevel || 0) +
        (row.analysisLevel || 0) +
        (row.creationLevel || 0),
      total:
        (row.timeManagement || 0) +
        (row.engagement || 0) +
        (row.recall || 0) +
        (row.problemSolving || 0) +
        (row.recall2 || 0) +
        (row.problemSolving2 || 0) +
        (row.toExp || 0) +
        (row.processing || 0) +
        (row.decisionMaking || 0) +
        (row.formulation || 0) +
        (row.analysis || 0) +
        (row.implementation || 0) +
        (row.understandingLevel || 0) +
        (row.analysisLevel || 0) +
        (row.creationLevel || 0),
    }));

    this.isLoading = false;
  }

  createRows() {
    this.sampleData = [
      [
        this.pointPlan, // Ensure this is an array
      ],
      this.cloList.map((clo: any) => ({
        id: '',
        cloId: clo.id,
        cloName: clo.cloName,
        cloType: clo.type,
        lessonId: 0,
        timeManagement: 0,
        engagement: 0,
        recall: 0,
        problemSolving: 0,
        recall2: 0,
        problemSolving2: 0,
        toExp: 0,
        processing: 0,
        decisionMaking: 0,
        formulation: 0,
        analysis: 0,
        implementation: 0,
        understandingLevel: 0,
        analysisLevel: 0,
        creationLevel: 0,
      })),
    ];
    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(this.wrapRow(data));
    });
  }
  populateCLOForm() {
    this.sampleData = [[this.pointPlan], this.cloPlan];

    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(this.wrapRow(data));
    });
  }

  private wrapRow(data: any) {
    return {
      id: data.id,
      lessonId: data.lessonId,
      cloId: data.cloId,
      cloName: data.cloName,
      cloType: data.cloType,
      timeManagement: data.timeManagement,
      engagement: data.engagement,
      recall: data.recall,
      problemSolving: data.problemSolving,
      recall2: data.recall2,
      problemSolving2: data.problemSolving2,
      toExp: data.toExp,
      processing: data.processing,
      decisionMaking: data.decisionMaking,
      formulation: data.formulation,
      analysis: data.analysis,
      implementation: data.implementation,
      understandingLevel: data.understandingLevel,
      analysisLevel: data.analysisLevel,
      creationLevel: data.creationLevel,
    };
  }

  getTotalScore(row: any): number {
    return (
      (row.timeManagement || 0) +
      (row.engagement || 0) +
      (row.recall || 0) +
      (row.problemSolving || 0) +
      (row.recall2 || 0) +
      (row.problemSolving2 || 0) +
      (row.toExp || 0) +
      (row.processing || 0) +
      (row.decisionMaking || 0) +
      (row.formulation || 0) +
      (row.analysis || 0) +
      (row.implementation || 0)
    );
  }

  getGroupHeaderLabel(cloType: string): string {
    switch (cloType) {
      case 'LEC':
        return 'Лекцийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'SEM':
        return 'Семинарын хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'LAB':
        return 'Лабораторийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      default:
        return cloType;
    }
  }
}
