import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ServisioService } from '../servisio/servisio.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  role: string | null = null;
  unreadMessages: number = 0; 
  loggedInUser: any = null;   

  constructor(private navCtrl: NavController, private servisioService: ServisioService) { }

  ngOnInit() {
    // Obtener el rol del usuario
    this.role = this.servisioService.getUserRole();
    
    // Obtener los datos del usuario logueado
    this.loggedInUser = this.servisioService.getLoggedUserData();
    
    // Obtener la cantidad de mensajes no leídos
    if (this.loggedInUser && this.loggedInUser.id) {
      this.getUnreadMessagesCount(this.loggedInUser.id);
    }
  }

  // Función para obtener el número de mensajes no leídos
  getUnreadMessagesCount(userId: number) {
    this.servisioService.getUnreadMessages(userId).subscribe(
      (response: any) => {
        this.unreadMessages = response.unreadCount; // Asignar la cantidad de mensajes no leídos
      },
      (error) => {
        console.error('Error al obtener los mensajes no leídos', error);
      }
    );
  }

  // Navegar a la página de signos vitales
  signos() {
    this.navCtrl.navigateForward('/signos');
  }

  // Navegar a la página de medicamentos
  medicamento() {
    this.navCtrl.navigateForward('/medicamentos');
  }

  // Navegar a la página de medicamentos (para pacientes)
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
  backupDatabase() {
    this.servisioService.backupDatabase().subscribe(
        (response: any) => {
            if (response && response.success) {
                // Abre el archivo de respaldo en una nueva pestaña
                window.open(response.fileUrl, '_blank');
            } else {
                console.error('Error al generar el respaldo de la base de datos:', response ? response.message : 'Respuesta vacía');
            }
        },
        (error) => {
            console.error('Error en la solicitud de respaldo:', error);
        }
    );
}

}
