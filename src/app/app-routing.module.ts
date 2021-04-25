import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'sector/:id/:sector',
    loadChildren: () => import('./sector/sector.module').then( m => m.SectorPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./overview/overview.module').then( m => m.OverviewPageModule)
  },
  {
    path: 'available-orders',
    loadChildren: () => import('./available-orders/available-orders.module').then(m => m.AvalaibleOrdersPageModule)
  },
  {
    path: 'pending-orders',
    loadChildren: () => import('./pending-orders/pending-orders.module').then( m => m.PendingOrdersPageModule)
  },
  {
    path: 'detail-delivery',
    loadChildren: () => import('./detail-delivery/detail-delivery.module').then( m => m.DetailDeliveryPageModule)
  },
  {
    path: 'delivered-orders',
    loadChildren: () => import('./delivered-orders/delivered-orders.module').then( m => m.DeliveredOrdersPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'delivered-orders',
    loadChildren: () => import('./delivered-orders/delivered-orders.module').then( m => m.DeliveredOrdersPageModule)
  },
  {
    path: 'header',
    loadChildren: () => import('./header/header.module').then( m => m.HeaderPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
