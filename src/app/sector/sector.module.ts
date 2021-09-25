import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SectorPageRoutingModule } from './sector-routing.module';

import { SectorPage } from './sector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectorPageRoutingModule
  ],
  declarations: [SectorPage]
})
export class SectorPageModule {}
