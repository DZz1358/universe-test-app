import { Routes } from '@angular/router';

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
    canActivate: [],
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
