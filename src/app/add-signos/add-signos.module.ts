import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSignosPageRoutingModule } from './add-signos-routing.module';

import { AddSignosPage } from './add-signos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSignosPageRoutingModule
  ],
  declarations: [AddSignosPage]
})
export class AddSignosPageModule {}
