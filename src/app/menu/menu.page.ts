import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ServisioService } from '../servisio/servisio.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  role: string | null = null; // Variable para almacenar el rol del usuario

  constructor(private navCtrl: NavController, private servisioService: ServisioService) { }

  ngOnInit() {
    this.role = this.servisioService.getUserRole();  // Obtener el rol del usuario logueado
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
