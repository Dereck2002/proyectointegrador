import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPacientesPage } from './list-pacientes.page';

const routes: Routes = [
  {
    path: '',
    component: ListPacientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPacientesPageRoutingModule {}
