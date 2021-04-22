import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveredOrdersPageRoutingModule } from './delivered-orders-routing.module';

import { DeliveredOrdersPage } from './delivered-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveredOrdersPageRoutingModule
  ],
  declarations: [DeliveredOrdersPage]
})
export class DeliveredOrdersPageModule {}
