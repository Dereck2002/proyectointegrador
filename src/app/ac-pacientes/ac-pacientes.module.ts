import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcPacientesPageRoutingModule } from './ac-pacientes-routing.module';

import { AcPacientesPage } from './ac-pacientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcPacientesPageRoutingModule
  ],
  declarations: [AcPacientesPage]
})
export class AcPacientesPageModule {}
