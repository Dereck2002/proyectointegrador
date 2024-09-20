import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarMedicoPageRoutingModule } from './registrar-medico-routing.module';

import { RegistrarMedicoPage } from './registrar-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarMedicoPageRoutingModule
  ],
  declarations: [RegistrarMedicoPage]
})
export class RegistrarMedicoPageModule {}
