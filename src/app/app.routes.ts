import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/menu', pathMatch: 'full' },

  {
    path: 'tabs',
    loadComponent: () => import('./tabs').then(m => m.TabsPage),
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./features/menu/menu.page').then(m => m.MenuPage)
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/cart.page').then(m => m.CartPage)
      },
      {
        path: 'orders',
        // Signed-in users only; the guard redirects others to /login.
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/orders/orders.page').then(m => m.OrdersPage)
      },
      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.page').then(m => m.LoginPage)
  },

  // Old bookmarks keep working.
  { path: 'menu', redirectTo: 'tabs/menu' },
  { path: 'cart', redirectTo: 'tabs/cart' },
  { path: 'orders', redirectTo: 'tabs/orders' },
  { path: '**', redirectTo: 'tabs/menu' }
];
