import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvalaibleOrdersPageRoutingModule } from './available-orders-routing.module';

import { AvailableOrdersPage } from './available-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvalaibleOrdersPageRoutingModule
  ],
  declarations: [AvailableOrdersPage]
})
export class AvalaibleOrdersPageModule {}
