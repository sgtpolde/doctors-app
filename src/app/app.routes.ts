import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/home/routes').then((m) => m.homeRoutes),
  },
  {
    path: 'doctors',
    loadChildren: () =>
      import('./features/doctors/routes').then((m) => m.doctorRoutes),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/routes').then((m) => m.taskRoutes),
  },
  { path: '**', redirectTo: '' },
];
