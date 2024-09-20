import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  rol: string | null = null; // Variable para almacenar el rol del usuario

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.rol = localStorage.getItem('rol');  // Obtener el rol del localStorage
  }
  
  // Navegar a la página de signos
  signos() {
    this.navCtrl.navigateForward('/signos');
  }

  // Navegar a la página de medicamentos
  medicamento() {
    this.navCtrl.navigateForward('/medicamentos');
  }

  // Navegar a la página de medicamentos pacientes
  medicamentop() {
    this.navCtrl.navigateForward('/medicamentosp');
  }

  // Navegar a la página de mensajes
  mensaje() {
    this.navCtrl.navigateForward('/historial');
  }

  // Navegar al perfil
  openHistorial() {
    this.navCtrl.navigateForward('/perfil');
  }
}
