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

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [CommonModule, TabsModule, MainInfoComponent, MaterialsComponent, CloComponent, ScheduleComponent, AssessmentComponent, AdditionalComponent],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss'
})
export class CurriculumComponent {
  lessonId: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';
  }

}
