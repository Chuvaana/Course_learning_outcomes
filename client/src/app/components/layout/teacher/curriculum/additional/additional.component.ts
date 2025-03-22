import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-additional',
  imports: [],
  templateUrl: './additional.component.html',
  styleUrl: './additional.component.scss'
})
export class AdditionalComponent {
  @Input() lessonId: string = '';

  ngOnInit() {
  }
}
