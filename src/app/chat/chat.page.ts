import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  mensajes: any[] = [];  // Lista de mensajes
  nuevoMensaje: string = '';  // Nuevo mensaje a enviar
  userId: number = 0;  // ID del usuario logueado
  chatPartnerId: number = 0;  // ID del doctor o paciente con el que está chateando
  rol: string = '';  // Rol del usuario logueado (medico o paciente)

  constructor(
    private route: ActivatedRoute,
    private servisioService: ServisioService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.rol = this.servisioService.getUserRole();
    const loggedUserData = this.servisioService.getLoggedUserData();

    if (this.rol === 'medico') {
      this.userId = loggedUserData.cod_medico;
    } else if (this.rol === 'paciente') {
      this.userId = loggedUserData.cod_usuario;
    }

    // Obtener el ID del usuario con el que se está chateando (el doctor o el paciente)
    this.route.queryParams.subscribe(params => {
      this.chatPartnerId = params['userId'];  // El ID del usuario de la conversación
      this.cargarMensajes();
    });
  }

  // Cargar los mensajes de la conversación
  cargarMensajes() {
    this.servisioService.listMensajes(this.chatPartnerId, this.rol).subscribe(response => {
      this.mensajes = response.map((mensaje: { isSentByUser: boolean; cod_medico: number; cod_usuario: number; }) => {
        mensaje.isSentByUser = mensaje.cod_medico === this.userId || mensaje.cod_usuario === this.userId;
        return mensaje;
      });
    });
  }

  // Enviar un nuevo mensaje
  enviarMensaje() {
    if (this.nuevoMensaje.trim() !== '') {
      const nuevoMensaje = {
        mensaje: this.nuevoMensaje,
        cod_medico: this.rol === 'medico' ? this.userId : this.chatPartnerId,
        cod_usuario: this.rol === 'paciente' ? this.userId : this.chatPartnerId
      };

      // Enviar mensaje a través del servicio
      this.servisioService.enviarMensaje(nuevoMensaje).subscribe(async () => {
        // Añadir el nuevo mensaje a la lista
        this.mensajes.push({
          user: 'Yo',
          content: this.nuevoMensaje,
          timestamp: new Date(),
          isSentByUser: true
        });
        this.nuevoMensaje = '';  // Limpiar el campo de entrada
        await this.showToast('Mensaje enviado.');
      });
    }
  }

  // Mostrar mensajes (toast)
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }
}
