import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponent } from '../shared/shared.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { CloComponent } from './lesson-list/lesson/clo/clo.component';
import { LessonComponent } from './lesson-list/lesson/lesson.component';
import { TeacherComponent } from './teacher.component';
import { LesStudentComponent } from './lesson-list/lesson/les-student/les-student.component';
import { CloPointComponent } from './lesson-list/lesson/clo-point/clo-point.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      {
        path: 'lessonList',
        component: LessonListComponent,
        children: [
          {
            path: 'lesson/:id',
            component: LessonComponent, // ✅ Should be LessonComponent, not SharedComponent
          },
        ]
      },
      {
        path: 'lesson',
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
          }
        ]
      }, // ✅ Fixed path for SharedComponent
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
