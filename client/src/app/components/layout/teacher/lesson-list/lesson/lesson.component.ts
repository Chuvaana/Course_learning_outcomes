import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { MenuComponent } from '../../menu/menu.component';
@Component({
  selector: 'app-lesson',
  imports: [RouterModule, TieredMenuModule, ToastModule, MenuComponent],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss',
})
export class LessonComponent {
  lessonId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';
  }
}
