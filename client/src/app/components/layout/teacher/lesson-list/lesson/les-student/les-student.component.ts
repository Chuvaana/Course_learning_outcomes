import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TeacherService } from '../../../../../../services/teacherService';
import { CLOService } from '../../../../../../services/cloService';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-les-student',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumber],
  providers: [MessageService],
  templateUrl: './les-student.component.html',
  styleUrl: './les-student.component.scss'
})
export class LesStudentComponent {

  cloForm!: FormGroup;
  sampleData!: any;
  cloList!: any;
  pointPlan!: any;
  cloPlan!: any;
  isUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: TeacherService,
    private cloService: CLOService,
    private msgService: MessageService) { }

  ngOnInit() {
    this.cloForm = this.fb.group({
      cloRows: this.fb.array([]),
    });

    this.service.getCloList().subscribe((res) => {
      if (res) {
        this.cloList = res;
      }
    });

    this.cloService.getPointPlan().subscribe((res) => {
      if (res === null || (Array.isArray(res) && res.length === 0)) {
        // If res is null or an empty array
        this.pointPlan = {
          timeManagement: 5,
          engagement: 5,
          recall: 5,
          problemSolving: 5,
          recall2: 5,
          problemSolving2: 5,
          toExp: 15,
          processing: 5,
          decisionMaking: 5,
          formulation: 5,
          analysis: 5,
          implementation: 5,
          understandingLevel: 5,
          analysisLevel: 10,
          creationLevel: 15
        };
      } else {
        // If res is not null and not an empty array
        this.pointPlan = res;
      }
    });

    this.cloService.getCloPlan().subscribe((res) => {
      if (res) {
        this.cloPlan = res;
        if ((Array.isArray(this.cloPlan[0]) && this.cloPlan[0].length === 0)) {
          this.cloPlan[0] = [this.pointPlan];
        }
        if ((Array.isArray(this.cloPlan[1]) && this.cloPlan[1].length === 0)) {
          this.createRows();
        } else {
          this.isUpdate = true;
          this.populateCLOForm();
        }
      }
    });
  }

  get cloRows(): FormArray {
    return this.cloForm.get('cloRows') as FormArray;
  }

  getRowGroup(index: number): FormGroup {
    return this.cloRows.at(index) as FormGroup;
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
        creationLevel: 0
      }))
    ];
    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(
        this.fb.group({
          id: [data.id],
          cloId: [data.cloId],
          cloName: [data.cloName],
          cloType: [data.cloType],
          timeManagement: [data.timeManagement],
          engagement: [data.engagement],
          recall: [data.recall],
          problemSolving: [data.problemSolving],
          recall2: [data.recall2],
          problemSolving2: [data.problemSolving2],
          toExp: [data.toExp],
          processing: [data.processing],
          decisionMaking: [data.decisionMaking],
          formulation: [data.formulation],
          analysis: [data.analysis],
          implementation: [data.implementation],
          understandingLevel: [data.understandingLevel],
          analysisLevel: [data.analysisLevel],
          creationLevel: [data.creationLevel]
        })
      );
    });
    console.log(this.sampleData);
  }
  populateCLOForm() {
    this.sampleData = this.cloPlan;

    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(
        this.fb.group({
          id: [data.id],
          cloId: [data.cloId],
          cloName: [data.cloName],
          cloType: [data.cloType],
          timeManagement: [data.timeManagement],
          engagement: [data.engagement],
          recall: [data.recall],
          problemSolving: [data.problemSolving],
          recall2: [data.recall2],
          problemSolving2: [data.problemSolving2],
          toExp: [data.toExp],
          processing: [data.processing],
          decisionMaking: [data.decisionMaking],
          formulation: [data.formulation],
          analysis: [data.analysis],
          implementation: [data.implementation],
          understandingLevel: [data.understandingLevel],
          analysisLevel: [data.analysisLevel],
          creationLevel: [data.creationLevel]
        })
      );
    });
  }

  onSubmit(): void {
    const formData = this.cloForm.value.cloRows;

    // Check if we are updating or creating
    if (this.isUpdate) {
      this.updateCloPlan(formData);
    } else {
      this.cloService.saveCloPlan(formData).subscribe(
        (res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Амжилттай хадгалагдлаа',
          });
          this.populateCLOForm();
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    }
  }

  updateCloPlan(updatedData: any): void {
    this.cloService.updateCloPlan(updatedData).subscribe(
      (res) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Амжилттай шинэчэгдлээ',
        });
        // Optionally, refresh the data or navigate away
      },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Алдаа гарлаа: ' + err.message,
        });
      }
    );
  }
}
