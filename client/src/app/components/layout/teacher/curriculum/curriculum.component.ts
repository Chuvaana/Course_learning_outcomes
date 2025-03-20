import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MainInfoComponent } from './main-info/main-info.component';
import { MaterialsComponent } from './materials/materials.component';
import { ClosComponent } from './clos/clos.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AdditionalComponent } from './additional/additional.component';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [CommonModule, TabsModule, MainInfoComponent, MaterialsComponent, ClosComponent, ScheduleComponent, AssessmentComponent, AdditionalComponent],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss'
})
export class CurriculumComponent {

}
