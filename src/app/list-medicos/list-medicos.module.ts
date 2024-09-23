import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListMedicosPageRoutingModule } from './list-medicos-routing.module';

import { ListMedicosPage } from './list-medicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListMedicosPageRoutingModule
  ],
  declarations: [ListMedicosPage]
})
export class ListMedicosPageModule {}
