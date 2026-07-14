import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./customer/pages/home/home').then((m) => m.Home),
  },
  {
    path: 'urunler/:id',
    loadComponent: () =>
      import('./customer/pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'sepet',
    canActivate: [authGuard],
    loadComponent: () => import('./customer/pages/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'hesabim/siparislerim',
    canActivate: [authGuard],
    loadComponent: () => import('./customer/pages/orders/orders').then((m) => m.Orders),
  },
  {
    path: 'hesabim',
    canActivate: [authGuard],
    loadComponent: () => import('./customer/pages/account/account').then((m) => m.Account),
  },
  {
    path: 'login',
    loadComponent: () => import('./customer/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./customer/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/pages/login/login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'urunler',
        loadComponent: () => import('./admin/pages/products/products').then((m) => m.Products),
      },
      {
        path: 'kategoriler',
        loadComponent: () =>
          import('./admin/pages/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'siparisler',
        loadComponent: () => import('./admin/pages/orders/orders').then((m) => m.AdminOrders),
      },
      {
        path: 'kullanicilar',
        loadComponent: () => import('./admin/pages/users/users').then((m) => m.Users),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
