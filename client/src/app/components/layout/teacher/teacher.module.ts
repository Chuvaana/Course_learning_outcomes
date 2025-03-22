import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponent } from '../shared/shared.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { CloPlanComponent } from './lesson-list/lesson/clo-plan/clo-plan.component';
import { CloPointComponent } from './lesson-list/lesson/clo-point/clo-point.component';
import { CloComponent } from './lesson-list/lesson/clo/clo.component';
import { LesStudentComponent } from './lesson-list/lesson/les-student/les-student.component';
import { LessonComponent } from './lesson-list/lesson/lesson.component';
import { TeacherComponent } from './teacher.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      {
        path: 'lessonList',
        component: LessonListComponent
      },
      {
        path: 'lesson/:id',
        component: LessonComponent,
        children: [
          {
            path: 'clo',
            component: CloComponent,
          },
          {
            path: 'student',
            component: LesStudentComponent,
          },
          {
            path: 'clo-point',
            component: CloPointComponent
          },
          {
            path: 'clo-plan',
            component: CloPlanComponent
          },

        ]
      },
      {
        path: 'curriculum/:id',
        component: CurriculumComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LessonListComponent, // ✅ Explicitly importing standalone components
    LessonComponent,
    TeacherComponent,
    SharedComponent
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
  declarations: []
})
export class TeacherModule { }
