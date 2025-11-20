import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProfileSelectionComponent} from './auth/profile-selector/profile-selector.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginComponent
    },
    
    {
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: '**',
      redirectTo: '/login'
    }
  ];
