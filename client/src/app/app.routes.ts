import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { MainComponent } from './components/layout/shared/main/main.component';
import { RegisterLoginComponent } from './components/layout/teacher/register-login/register-login.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'teacher-login', component: RegisterLoginComponent },
    // { path: 'student-login', component: StudentLoginComponent },
    {
        path: 'main',
        component: LayoutComponent,
        children: [
            {
                path: 'admin',
                loadChildren: () =>
                    import('./components/layout/admin/admin.module').then((m) => m.AdminModule),
            },
            {
                path: 'teacher',
                loadChildren: () =>
                    import('./components/layout/teacher/teacher.module').then((m) => m.TeacherModule),
            },
            {
                path: 'student',
                loadChildren: () =>
                    import('./components/layout/student/student.module').then((m) => m.StudentModule),
            }
        ]
    },

];
