import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPacientesPageRoutingModule } from './list-pacientes-routing.module';

import { ListPacientesPage } from './list-pacientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPacientesPageRoutingModule
  ],
  declarations: [ListPacientesPage]
})
export class ListPacientesPageModule {}
