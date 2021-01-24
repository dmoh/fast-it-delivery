import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingOrdersPageRoutingModule } from './pending-orders-routing.module';

import { PendingOrdersPage } from './pending-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingOrdersPageRoutingModule
  ],
  declarations: [PendingOrdersPage]
})
export class PendingOrdersPageModule {}
