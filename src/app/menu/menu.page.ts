import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit  {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  
signos(){
  this.navCtrl.navigateForward('/add-signos');
}
medicamento(){
  this.navCtrl.navigateForward('/add-medicamento');
}
mensaje(){
  this.navCtrl.navigateForward('/mensajes');
}
openHistorial(){
  this.navCtrl.navigateForward('/historial');
}
}
