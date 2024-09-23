import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMedicosPage } from './list-medicos.page';

const routes: Routes = [
  {
    path: '',
    component: ListMedicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListMedicosPageRoutingModule {}
