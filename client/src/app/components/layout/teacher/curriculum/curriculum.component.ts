import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { AdditionalComponent } from './additional/additional.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { CloComponent } from './clo/clo.component';
import { MainInfoComponent } from './main-info/main-info.component';
import { MaterialsComponent } from './materials/materials.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { OtherComponent } from './other/other.component';
import { MethodologyComponent } from './methodology/methodology.component';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    MainInfoComponent,
    OtherComponent,
    MaterialsComponent,
    CloComponent,
    ScheduleComponent,
    AssessmentComponent,
    AdditionalComponent,
    MethodologyComponent],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss'
})
export class CurriculumComponent {
  lessonId!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.lessonId = params.get('id')!; // Get "id" from the parent route
      console.log('Lesson ID:', this.lessonId);
    });
  }

}
