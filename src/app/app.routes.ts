import { Routes } from '@angular/router';
import { authTokenGuard } from './shared/guards/auth-token.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then((m) => m.LoginComponent),
    canActivate: [],
  },
  {
    path: 'registration',
    loadComponent: () => import('./features/auth/components/registration/registration.component').then((m) => m.RegistrationComponent),
    canActivate: [],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authTokenGuard],
  },
  {
    path: 'document/:id',
    loadComponent: () => import('./shared/components/view-or-edit/view-or-edit.component').then((m) => m.ViewOrEditComponent),
    canActivate: [authTokenGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
