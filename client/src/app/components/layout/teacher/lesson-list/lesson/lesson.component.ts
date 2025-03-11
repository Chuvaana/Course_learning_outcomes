import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-lesson',
  imports: [NavbarComponent, RouterModule],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss'
})
export class LessonComponent {
  lessonId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Lesson ID:', this.lessonId);
  }
}
