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
  rol: string = '';  // Rol del usuario ('medico', 'paciente', o 'administrador')
  recipients: any[] = [];  // Lista de destinatarios (pacientes o médicos)
  filteredRecipients: any[] = [];  // Lista filtrada de destinatarios
  selectedRecipient: any;  // Destinatario seleccionado
  searchQuery: string = '';  // Campo de búsqueda

  constructor(private servisioService: ServisioService, private toastController: ToastController, private navCtrl: NavController) {}

  ngOnInit() {
    // Obtener el rol del usuario desde el localStorage
    this.rol = this.servisioService.getUserRole();

    // Si el rol es médico, carga la lista de pacientes. Si es paciente, carga la lista de médicos. Si es administrador, carga ambas listas.
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
        this.filteredRecipients = this.recipients;  // Inicializar la lista filtrada
      });
    });
  }

  // Enviar mensaje
  enviarMensaje() {
    if (this.mensaje.contenido.trim() === '') {
      this.showToast('El mensaje no puede estar vacío.');
      return;
    }

    const loggedUserData = this.servisioService.getLoggedUserData();

    if (this.rol === 'medico') {
      this.mensaje.cod_medico = loggedUserData?.cod_medico || null;
      this.mensaje.cod_usuario = this.selectedRecipient.id;
    } else if (this.rol === 'paciente') {
      this.mensaje.cod_usuario = loggedUserData?.cod_usuario || null;
      this.mensaje.cod_medico = this.selectedRecipient.id;
    } else if (this.rol === 'administrador') {
      if (this.selectedRecipient.tipo === 'medico') {
        this.mensaje.cod_medico = this.selectedRecipient.id;
        this.mensaje.cod_usuario = null;
      } else if (this.selectedRecipient.tipo === 'paciente') {
        this.mensaje.cod_usuario = this.selectedRecipient.id;
        this.mensaje.cod_medico = null;
      }
    }

    if (!this.mensaje.cod_medico && !this.mensaje.cod_usuario) {
      this.showToast('No se pudo obtener los datos del remitente o destinatario.');
      return;
    }

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
