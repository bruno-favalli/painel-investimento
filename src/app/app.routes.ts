import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProfileSelectorComponent} from './auth/profile-selector/profile-selector.component';

export const routes: Routes = [
    {
        path: '',
        component: ProfileSelectorComponent,
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];
