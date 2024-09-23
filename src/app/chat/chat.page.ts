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
  userId: number = 0;  // ID del usuario logueado (médico o paciente)
  chatPartnerId: number = 0;  // ID del doctor o paciente con el que está chateando
  rol: string = '';  // Rol del usuario logueado (medico o paciente)
  chatPartnerName: string = '';  // Nombre del médico o paciente con el que se está chateando
  userName: string = '';  // Nombre del usuario logueado

  constructor(
    private route: ActivatedRoute,
    private servisioService: ServisioService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.rol = this.servisioService.getUserRole();
    const loggedUserData = this.servisioService.getLoggedUserData();

    // Determinar si es médico o paciente y obtener el nombre del usuario logueado
    if (this.rol === 'medico') {
      this.userId = loggedUserData.cod_medico;
      this.userName = loggedUserData.nom_medico;  // Nombre del médico
    } else if (this.rol === 'paciente') {
      this.userId = loggedUserData.cod_usuario;
      this.userName = loggedUserData.nom_usuario;  // Nombre del paciente
    }

    // Obtener el ID del usuario con el que se está chateando (el doctor o el paciente)
    this.route.queryParams.subscribe(params => {
      this.chatPartnerId = params['userId'];  // El ID del usuario de la conversación
      this.chatPartnerName = params['userName'];  // Nombre del usuario de la conversación
      this.cargarMensajes();
    });
  }

  // Cargar los mensajes de la conversación
  cargarMensajes() {
    this.servisioService.listMensajes(this.chatPartnerId, this.rol).subscribe(response => {
      this.mensajes = response.map((mensaje: any) => {
        // Determinar si el mensaje fue enviado por el usuario logueado
        mensaje.isSentByUser = this.esMensajeEnviadoPorUsuario(mensaje);
        
        // Asignar el nombre correcto basado en quien envió el mensaje
        if (mensaje.isSentByUser) {
          // Si el usuario logueado envió el mensaje
          mensaje.user = this.userName;
        } else {
          // Si el chat partner (doctor o paciente) envió el mensaje
          mensaje.user = mensaje.nom_medico || mensaje.nom_usuario;  // Nombre real del remitente (médico o paciente)
        }
  
        return mensaje;
      });
    });
  }
  


  // Determinar si el mensaje fue enviado por el usuario logueado
  esMensajeEnviadoPorUsuario(mensaje: any): boolean {
    if (this.rol === 'medico') {
      return mensaje.cod_medico === this.userId;
    } else if (this.rol === 'paciente') {
      return mensaje.cod_usuario === this.userId;
    }
    return false;
  }

  // Enviar un nuevo mensaje
  enviarMensaje() {
    if (this.nuevoMensaje.trim() !== '') {
      let nuevoMensaje;

      // Si el usuario logueado es un médico
      if (this.rol === 'medico') {
        nuevoMensaje = {
          mensaje: this.nuevoMensaje,
          cod_medico: this.userId,  // El ID del médico logueado
          cod_usuario: this.chatPartnerId  // El ID del paciente (chat partner)
        };
      }
      // Si el usuario logueado es un paciente
      else if (this.rol === 'paciente') {
        nuevoMensaje = {
          mensaje: this.nuevoMensaje,
          cod_usuario: this.userId,  // El ID del paciente logueado
          cod_medico: this.chatPartnerId  // El ID del médico (chat partner)
        };
      }

      // Enviar mensaje a través del servicio
      this.servisioService.enviarMensaje(nuevoMensaje).subscribe(async () => {
        // Añadir el nuevo mensaje a la lista
        this.mensajes.push({
          user: this.userName,  // Nombre del usuario logueado
          mensaje: this.nuevoMensaje,
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
