import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectorPage } from './sector.page';

const routes: Routes = [
  {
    path: '',
    component: SectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectorPageRoutingModule {}
