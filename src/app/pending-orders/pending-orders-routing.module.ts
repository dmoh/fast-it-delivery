import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingOrdersPage } from './pending-orders.page';

const routes: Routes = [
  {
    path: '',
    component: PendingOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingOrdersPageRoutingModule {}
