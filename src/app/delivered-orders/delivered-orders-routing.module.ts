import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveredOrdersPage } from './delivered-orders.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveredOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveredOrdersPageRoutingModule {}
