import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  mensajes: any[] = [];
  rol: string = '';  // Rol del usuario ('medico', 'paciente', o 'administrador')
  userId: number = 0;  // ID del usuario logueado

  constructor(
    private servisioService: ServisioService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Obtener el rol y el ID del usuario logueado desde el almacenamiento
    this.rol = this.servisioService.getUserRole();
    const loggedUserData = this.servisioService.getLoggedUserData();
  
    // Comprobar si es un médico, paciente o administrador y obtener su ID correspondiente
    if (this.rol === 'medico') {
      this.userId = loggedUserData.cod_medico;  // Obtener el cod_medico
    } else if (this.rol === 'paciente') {
      this.userId = loggedUserData.cod_usuario;  // Obtener el cod_usuario
    } else if (this.rol === 'administrador') {
      this.userId = loggedUserData.cod_admin;  // Obtener el cod_admin
    }
  
    // Verificar que se ha obtenido correctamente el ID del usuario
    if (this.userId) {
      this.loadMensajes();  // Cargar el historial de mensajes
    } else {
      console.error('No se pudo obtener el ID del usuario logueado');
    }
  }
  
  loadMensajes() {
    this.servisioService.listMensajes(this.userId, this.rol).subscribe(response => {
      this.mensajes = response.map((mensaje: any) => {
        // Si el mensaje fue enviado por el médico
        if (mensaje.cod_medico) {
          mensaje.user = `${mensaje.nom_medico} ${mensaje.ape_medico}`;  // Nombre completo del médico
        } 
        // Si el mensaje fue enviado por el paciente
        else if (mensaje.cod_usuario) {
          mensaje.user = `${mensaje.nom_usuario} ${mensaje.ape_usuario}`;  // Nombre completo del paciente
        }
        // Retornar el mensaje con el nombre asignado
        return mensaje;
      });
    }, error => {
      console.error('Error al cargar los mensajes:', error);
    });
  }
  
  // Redirigir a la página de chat con el mensaje seleccionado
  goToChat(mensaje: any) {
    this.navCtrl.navigateForward(`/chat`, {
      queryParams: { userId: this.userId, mensajeId: mensaje.id }
    });
  }

  // Editar mensaje
  async editMensaje(mensaje: any) {
    const alert = await this.alertController.create({
      header: 'Editar Mensaje',
      inputs: [
        {
          name: 'mensaje',
          type: 'text',
          value: mensaje.mensaje,
          placeholder: 'Nuevo mensaje'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: data => {
            if (data.mensaje) {
              // Llamar a la función del servicio para actualizar el mensaje
              this.servisioService.updateMensaje(mensaje.id, data.mensaje).subscribe(async () => {
                mensaje.mensaje = data.mensaje;  // Actualizar el mensaje en la lista
                await this.showToast('Mensaje actualizado exitosamente.');
              });
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  // Eliminar mensaje
  async deleteMensaje(mensaje: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este mensaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.servisioService.deleteMensaje(mensaje.id).subscribe(async () => {
              this.mensajes = this.mensajes.filter(m => m.id !== mensaje.id);
              await this.showToast('Mensaje eliminado exitosamente.');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // Mostrar un mensaje (toast)
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    toast.present();
  }
}
