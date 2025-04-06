import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ExamQuestionListComponent } from '../exam/exam-question-list/exam-question-list.component';
import { ExamImportComponent } from '../exam/import/exam-import.component';
import { QuestionListComponent } from '../exam/list/list.component';
import { QuestionComponent } from '../exam/question/question.component';
import { SharedComponent } from '../shared/shared.component';
import { LabGradeComponent } from './course-grades/lab-grade/lab-grade.component';
import { SemGradeComponent } from './course-grades/sem-grade/sem-grade.component';
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
          { path: 'student', component: LesStudentComponent },
          { path: 'studentList', component: LesStudentListComponent },
          { path: 'clo-point', component: CloPointComponent },
          { path: 'clo-tree', component: CloTreeComponent },
          { path: 'clo-plan', component: CloPlanComponent },
          { path: 'attendance', component: AttendanceComponent },
          { path: 'curriculum', component: CurriculumComponent },
          { path: 'lab-grade', component: LabGradeComponent },
          { path: 'sem-grade', component: SemGradeComponent },
          { path: 'exam-import', component: ExamImportComponent },
        ],
      },
      {
        path: 'curriculum/:id',
        component: CurriculumComponent,
      },
      {
        path: 'curriculum',
        component: CurriculumComponent,
      },
      {
        path: 'question-create',
        component: QuestionComponent,
      },
      {
        path: 'questionlist',
        component: QuestionListComponent,
      },
      {
        path: 'exam-questionlist',
        component: ExamQuestionListComponent,
      },
    ],
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
    LessonListComponent,
    LessonComponent,
    LesStudentListComponent,
    LesStudentComponent,
    CloPointComponent,
    CloPlanComponent,
    CloTreeComponent,
    AttendanceComponent,
    CurriculumComponent,
    SharedComponent,
  ],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [],
})
export class TeacherModule {}
