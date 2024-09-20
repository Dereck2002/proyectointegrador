import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicamentospPage } from './medicamentosp.page';

const routes: Routes = [
  {
    path: '',
    component: MedicamentospPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicamentospPageRoutingModule {}
