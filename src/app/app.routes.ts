import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },

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
    loadComponent: () =>
      import('./features/orders/orders.page').then(m => m.OrdersPage)
  }
];
