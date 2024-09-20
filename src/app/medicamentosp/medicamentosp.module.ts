import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicamentospPageRoutingModule } from './medicamentosp-routing.module';

import { MedicamentospPage } from './medicamentosp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicamentospPageRoutingModule
  ],
  declarations: [MedicamentospPage]
})
export class MedicamentospPageModule {}
