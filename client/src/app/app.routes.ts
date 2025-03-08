import { Routes } from '@angular/router';
import { TeacherRegistrationComponent } from './components/teacher/teacher-registration/teacher-registration.component';
import { StudentImpoirtCompnent } from'./components/students/student_import/student-import.component';
import { StudentListCompnent } from './components/students/student_list/student-list.component';

export const routes: Routes = [
    {
        path: 'register-teacher',
        component: TeacherRegistrationComponent,
    },
    {
        path: 'student-import',
        component: StudentImpoirtCompnent,
    },
    {
        path: 'student-list',
        component: StudentListCompnent,
    }
];
