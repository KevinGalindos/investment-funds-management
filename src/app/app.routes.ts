import { Routes } from '@angular/router';

/**
 * Definición de rutas de la aplicación.
 * Usa lazy loading para cada página de feature.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'funds',
    pathMatch: 'full',
  },
  {
    path: 'funds',
    loadComponent: () => import('./features/funds/funds.component').then((m) => m.FundsComponent),
    title: 'Fondos Disponibles',
  },
  {
    path: 'my-funds',
    loadComponent: () =>
      import('./features/my-funds/my-funds.component').then((m) => m.MyFundsComponent),
    title: 'Mi Portafolio',
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transactions.component').then((m) => m.TransactionsComponent),
    title: 'Historial',
  },
  {
    path: '**',
    redirectTo: 'funds',
  },
];
