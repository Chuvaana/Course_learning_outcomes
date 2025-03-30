import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedComponent } from '../shared/shared.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { AttendanceComponent } from './lesson-list/lesson/attendance/attendance.component';
import { CloPlanComponent } from './lesson-list/lesson/clo-plan/clo-plan.component';
import { CloPointComponent } from './lesson-list/lesson/clo-point/clo-point.component';
import { CloTreeComponent } from './lesson-list/lesson/clo-tree/clo-tree.component';
import { LesStudentListComponent } from './lesson-list/lesson/les-student-list/les-student-list.component';
import { LesStudentComponent } from './lesson-list/lesson/les-student/les-student.component';
import { LessonComponent } from './lesson-list/lesson/lesson.component';
import { TeacherComponent } from './teacher.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      { path: 'lessonList', component: LessonListComponent },
      {
        path: 'lesson/:id',
        component: LessonComponent,
        children: [
          { path: 'student', component: LesStudentComponent, },
          { path: 'studentList', component: LesStudentListComponent },
          { path: 'clo-point', component: CloPointComponent },
          { path: 'clo-tree', component: CloTreeComponent },
          { path: 'clo-plan', component: CloPlanComponent },
          { path: 'attendance', component: AttendanceComponent },
          { path: 'curriculum', component: CurriculumComponent },
        ]
      },
      { path: 'curriculum', component: CurriculumComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    // Import standalone components
    TeacherComponent,
    LessonListComponent,
    LessonComponent,
    LesStudentListComponent,
    LesStudentComponent,
    CloPointComponent,
    CloPlanComponent,
    CloTreeComponent,
    AttendanceComponent,
    CurriculumComponent,
    SharedComponent
  ],
  exports: [RouterModule]
})
export class TeacherModule { }
