import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSignosPage } from './add-signos.page';

const routes: Routes = [
  {
    path: '',
    component: AddSignosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSignosPageRoutingModule {}
