import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-assessment',
  imports: [],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class AssessmentComponent {
  @Input() lessonId: string = '';

  ngOnInit() {
  }
}
