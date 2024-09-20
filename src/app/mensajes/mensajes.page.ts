import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {
  mensaje = {
    contenido: '',
    cod_usuario: null as number | null,  // ID del paciente
    cod_medico: null as number | null    // ID del médico
  };
  rol: string = '';  // Rol del usuario ('medico' o 'paciente')
  recipients: any[] = [];  // Lista de destinatarios (pacientes o médicos)
  selectedRecipient: any;  // Destinatario seleccionado
  navCtrl: any;

  constructor(private servisioService: ServisioService, private toastController: ToastController) {}

  ngOnInit() {
    // Obtener el rol del usuario desde el localStorage
    this.rol = localStorage.getItem('rol') || '';  // Rol del usuario ('medico' o 'paciente')

    // Si el rol es médico, carga la lista de pacientes. Si es paciente, carga la lista de médicos.
    if (this.rol === 'medico') {
      this.loadPacientes();
    } else if (this.rol === 'paciente') {
      this.loadMedicos();
    }
  }

  // Cargar lista de pacientes si el usuario es un médico
  loadPacientes() {
    this.servisioService.listPacientes().subscribe(response => {
      this.recipients = response.map((paciente: any) => ({
        nom: paciente.nom_usuario,
        ape: paciente.ape_usuario,
        id: paciente.cod_usuario
      }));
    });
  }

  // Cargar lista de médicos si el usuario es un paciente
  loadMedicos() {
    this.servisioService.listMedicos().subscribe(response => {
      this.recipients = response.map((medico: any) => ({
        nom: medico.nom_medico,
        ape: medico.ape_medico,
        id: medico.cod_medico
      }));
    });
  }

  // Enviar mensaje
  enviarMensaje() {
    if (this.mensaje.contenido.trim() === '') {
      this.showToast('El mensaje no puede estar vacío.');
      return;
    }

    // Obtener el código del usuario logueado desde el localStorage
    if (this.rol === 'medico') {
      // Si el usuario logueado es médico, asignar cod_medico al remitente y cod_usuario al destinatario
      this.mensaje.cod_medico = parseInt(localStorage.getItem('cod_medico')!, 10);  // El que está logueado
      this.mensaje.cod_usuario = this.selectedRecipient.id;  // El destinatario (paciente seleccionado)
    } else if (this.rol === 'paciente') {
      // Si el usuario logueado es paciente, asignar cod_usuario al remitente y cod_medico al destinatario
      this.mensaje.cod_usuario = parseInt(localStorage.getItem('cod_usuario')!, 10);  // El que está logueado
      this.mensaje.cod_medico = this.selectedRecipient.id;  // El destinatario (médico seleccionado)
    }

    // Verifica los valores antes de enviar el mensaje
    console.log('Enviando mensaje a:', this.selectedRecipient);
    console.log('cod_medico:', this.mensaje.cod_medico);
    console.log('cod_usuario:', this.mensaje.cod_usuario);

    // Enviar mensaje al servicio
    this.servisioService.enviarMensaje(this.mensaje).subscribe(response => {
      this.showToast('Mensaje enviado exitosamente.');
      this.mensaje.contenido = '';  // Limpiar el campo del mensaje
    }, error => {
      this.showToast('Error al enviar el mensaje.');
    });
  }

  // Mostrar mensajes de éxito/error
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  verHistorial() {
    this.navCtrl.navigateForward('/historial');
  }
}
