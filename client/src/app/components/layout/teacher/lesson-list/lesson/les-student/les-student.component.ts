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
  templateUrl: './les-student.component.html',
  styleUrl: './les-student.component.scss'
})
export class LesStudentComponent {

  cloForm!: FormGroup;
  sampleData!: any;
  cloList!: any;
  pointPlan!: any;
  cloPlan!: any;

  constructor(private fb: FormBuilder, private service: TeacherService, private cloService: CLOService) { }

  ngOnInit() {
    this.cloForm = this.fb.group({
      cloRows: this.fb.array([]),
    });

    // this.loadCLOData();

    this.service.getCloList().subscribe((res) => {
      if (res) {
        this.cloList = res;
      }
    });

    this.cloService.getPointPlan().subscribe((res) => {
      if (res === null || (Array.isArray(res) && res.length === 0)) {
        // If res is null or an empty array
        this.pointPlan = {
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
        };
      } else {
        // If res is not null and not an empty array
        this.pointPlan = res;
      }
    });

    this.cloService.getCloPlan().subscribe((res) => {
      if (res) {
        this.cloPlan = res;
        if (this.cloPlan === null || (Array.isArray(this.cloPlan[0]) && this.cloPlan[0].length === 0) || (Array.isArray(this.cloPlan[1]) && this.cloPlan[1].length === 0)) {
          this.createRows();
        } else {
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
        clos: clo.cloName,
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
  
    // Ensure that sampleData[0] is an array
    if (!Array.isArray(this.sampleData[0])) {
      this.sampleData[0] = [this.sampleData[0]]; // Wrap it in an array if it's not
    }
  
    
    this.sampleData = [
      [
        { timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 100, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
      ],
      [
        { clos: 'Математикийн ойлголтыг дүрс боловсруулалтад хэрэглэх;', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Зургийн боловсруулалтын хэрэгсэлүүдийг онцлог домайнд хэрхэн хэрэгжүүлэх ойлголт авах, тайлбарлах', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Практик асуудлыг шийдвэрлэхийн тулд алгоритмыг төлөвлөх, хэрэгжүүлэх замаар дүрс боловсруулалтын мэдлэгийг харуулах', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Дүрс боловсруулалтын чиглэлээр хийгдэж байгаа шинэ судалгааны ажлуудтай танилцах, мэдэх', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Зураг боловсруулах сантай ажиллан зураг боловсруулах аргуудыг хэрэглэх', cloType: 'LAB', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Онолын мэдлэг дээр тулгуурлан практик асуудлуудыг шийдвэрлэх.', cloType: 'LAB', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Бие даан туршилт судалгаан дээр суурилсан өгүүлэл бичих ба үр дүн харьцуулах.', cloType: 'LAB', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
      ]
    ];
    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(
        this.fb.group({
          clos: [data.clos],
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
    this.sampleData = [
      [
        this.pointPlan.map((point: any) => ({
          timeManagement: point.timeManagement,
          engagement: point.engagement,
          recall: point.recall,
          problemSolving: point.problemSolving,
          recall2: point.recall2,
          problemSolving2: point.problemSolving2,
          toExp: point.toExp,
          processing: point.processing,
          decisionMaking: point.decisionMaking,
          formulation: point.formulation,
          analysis: point.analysis,
          implementation: point.implementation,
          understandingLevel: point.understandingLevel,
          analysisLevel: point.analysisLevel,
          creationLevel: point.creationLevel
        }))
      ],
      this.cloPlan.map((clo: any) => ({
        clos: clo.cloName,    // Assign cloName to clos
        cloType: clo.type,    // Assign type to cloType
        timeManagement: clo.timeManagement,
        engagement: clo.engagement,
        recall: clo.recall,
        problemSolving: clo.problemSolving,
        recall2: clo.recall2,
        problemSolving2: clo.problemSolving2,
        toExp: clo.toExp,
        processing: clo.processing,
        decisionMaking: clo.decisionMaking,
        formulation: clo.formulation,
        analysis: clo.analysis,
        implementation: clo.implementation,
        understandingLevel: clo.understandingLevel,
        analysisLevel: clo.analysisLevel,
        creationLevel: clo.creationLevel
      }))
    ];


    this.sampleData[1].forEach((data: any) => {
      this.cloRows.push(
        this.fb.group({
          clos: [data.clos],
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



  loadCLOData() {
    this.sampleData = [
      [
        { timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 100, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
      ],
      [
        { clos: 'Математикийн ойлголтыг дүрс боловсруулалтад хэрэглэх;', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Зургийн боловсруулалтын хэрэгсэлүүдийг онцлог домайнд хэрхэн хэрэгжүүлэх ойлголт авах, тайлбарлах', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Практик асуудлыг шийдвэрлэхийн тулд алгоритмыг төлөвлөх, хэрэгжүүлэх замаар дүрс боловсруулалтын мэдлэгийг харуулах', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Дүрс боловсруулалтын чиглэлээр хийгдэж байгаа шинэ судалгааны ажлуудтай танилцах, мэдэх', cloType: 'LEC_SEM', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Зураг боловсруулах сантай ажиллан зураг боловсруулах аргуудыг хэрэглэх', cloType: 'LAB', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Онолын мэдлэг дээр тулгуурлан практик асуудлуудыг шийдвэрлэх.', cloType: 'LAB', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
        { clos: 'Бие даан туршилт судалгаан дээр суурилсан өгүүлэл бичих ба үр дүн харьцуулах.', cloType: 'LAB', timeManagement: 5, engagement: 3, recall: 5, problemSolving: 10, recall2: 5, problemSolving2: 10, toExp: 2, processing: 5, decisionMaking: 6, formulation: 7, analysis: 1, implementation: 2, understandingLevel: 2, analysisLevel: 2, creationLevel: 3 },
      ]
    ];

    

    this.sampleData[1].forEach((data: {
      clos: any;
      timeManagement: any;
      engagement: any;
      recall: any;
      problemSolving: any;
      recall2: any;
      problemSolving2: any;
      toExp: any;
      processing: any;
      decisionMaking: any;
      formulation: any;
      analysis: any,
      implementation: any,
      understandingLevel: any,
      analysisLevel: any,
      creationLevel: any
    }) => {
      this.cloRows.push(
        this.fb.group({
          clos: [data.clos],
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
    console.log('Saving Data:', formData);

    // // Example: Send to backend
    // fetch('https://your-api-url.com/save-clo-data', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(formData)
    // })
    //   .then(response => response.json())
    //   .then(data => console.log('Data saved successfully:', data))
    //   .catch(error => console.error('Error saving data:', error));
  }
}
