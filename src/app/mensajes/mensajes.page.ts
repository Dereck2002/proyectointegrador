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
    mensaje: '',  
    cod_usuario: null as number | null,  // ID del paciente
    cod_medico: null as number | null    // ID del médico
  };
  rol: string = '';  // Rol del usuario ('medico', 'paciente', o 'administrador')
  recipients: any[] = [];  // Lista de destinatarios (pacientes o médicos)
  filteredRecipients: any[] = [];  // Lista filtrada de destinatarios
  selectedRecipient: any;  // Destinatario seleccionado
  searchQuery: string = '';  // Campo de búsqueda

  constructor(private servisioService: ServisioService, private toastController: ToastController, private navCtrl: NavController) {}

  ngOnInit() {
    // Obtener el rol del usuario desde el almacenamiento
    this.rol = this.servisioService.getUserRole();

    // Cargar lista de destinatarios según el rol del usuario logueado
    if (this.rol === 'medico') {
      this.loadPacientes();
    } else if (this.rol === 'paciente') {
      this.loadMedicos();
    } else if (this.rol === 'administrador') {
      this.loadPacientesYMedicos();
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
      this.filteredRecipients = this.recipients;  // Inicializar la lista filtrada
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
      this.filteredRecipients = this.recipients;  // Inicializar la lista filtrada
    });
  }

  // Cargar lista de pacientes y médicos si el usuario es un administrador
  loadPacientesYMedicos() {
    this.servisioService.listPacientes().subscribe(response => {
      const pacientes = response.map((paciente: any) => ({
        nom: paciente.nom_usuario,
        ape: paciente.ape_usuario,
        id: paciente.cod_usuario,
        tipo: 'paciente'
      }));

      this.servisioService.listMedicos().subscribe(medicosResponse => {
        const medicos = medicosResponse.map((medico: any) => ({
          nom: medico.nom_medico,
          ape: medico.ape_medico,
          id: medico.cod_medico,
          tipo: 'medico'
        }));

        this.recipients = [...pacientes, ...medicos];
        this.filteredRecipients = this.recipients; 
      });
    });
  }

  // Enviar mensaje
  enviarMensaje() {
    // Verificar si el contenido del mensaje está vacío
    if (this.mensaje.mensaje.trim() === '') {
      this.showToast('El mensaje no puede estar vacío.');
      return;
    }

    // Verificar si el destinatario ha sido seleccionado
    if (!this.selectedRecipient) {
      this.showToast('Por favor, selecciona un destinatario.');
      return;
    }

    // Obtener los datos del usuario logueado
    const loggedUserData = this.servisioService.getLoggedUserData();

    // Asignar los valores de cod_medico y cod_usuario según el rol del usuario logueado
    if (this.rol === 'medico') {
      this.mensaje.cod_medico = loggedUserData?.cod_medico || null;
      this.mensaje.cod_usuario = this.selectedRecipient.id;  // ID del paciente seleccionado
    } else if (this.rol === 'paciente') {
      this.mensaje.cod_usuario = loggedUserData?.cod_usuario || null;
      this.mensaje.cod_medico = this.selectedRecipient.id;  // ID del médico seleccionado
    }

    // Validar que haya un destinatario antes de proceder
    if (!this.mensaje.cod_medico && !this.mensaje.cod_usuario) {
      this.showToast('No se pudo obtener los datos del remitente o destinatario.');
      return;
    }

    // Enviar el mensaje a través del servicio
    this.servisioService.enviarMensaje(this.mensaje).subscribe(
      async (response: any) => {
        if (response && response.message === 'Mensaje enviado exitosamente.') {
          this.showToast('Mensaje enviado exitosamente.');
          this.mensaje.mensaje = '';  // Limpiar el campo del mensaje
          this.navCtrl.navigateForward('/historial');  // Redirigir al historial
        } else {
          this.showToast('Error al enviar el mensaje: ' + (response?.message || 'Error desconocido.'));
        }
      },
      (error) => {
        this.showToast('Error en la solicitud al servidor.');
      }
    );
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // Filtrar destinatarios en función del texto ingresado en la barra de búsqueda
  filterRecipients(event: any) {
    const query = event.target.value.toLowerCase();
    if (query && query.trim() !== '') {
      this.filteredRecipients = this.recipients.filter(recipient =>
        recipient.nom.toLowerCase().includes(query) || recipient.ape.toLowerCase().includes(query)
      );
    } else {
      this.filteredRecipients = this.recipients;  // Mostrar todos los destinatarios si no hay texto
    }
  }

  verHistorial() {
    this.navCtrl.navigateForward('/historial');
  }
}
