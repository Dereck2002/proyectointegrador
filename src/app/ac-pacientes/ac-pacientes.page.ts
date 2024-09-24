import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ac-pacientes',
  templateUrl: './ac-pacientes.page.html',
  styleUrls: ['./ac-pacientes.page.scss'],
})
export class AcPacientesPage implements OnInit {
  paciente = {
    cedula: '',
    nom_usuario: '',
    ape_usuario: '',
    telefono_usuario: '',
    email_usuario: '',
    clave_usuario: '',
    fecha_nacimiento: '',
    direccion: '',
    sexo: '',
    grupo_sanguineo: '',
    alergias: '',
    enfermedades_cronicas: '',
    medicacion_actual: ''
  };

  confirmarClave = ''; // Campo para confirmar la contraseña
  editingPaciente: any = null;  // Paciente que se está editando
  claveNoCoincide: boolean = false;  // Indicador si las contraseñas no coinciden
  claveInvalida: boolean | undefined;

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    const state = history.state;
    if (state.patient) {
      this.paciente = { ...state.patient };
      this.editingPaciente = state.patient;
    }
  }

  // Función para agregar o actualizar un paciente
  submitPaciente() {
    
      if (this.editingPaciente) {
        this.servisioService.updatePaciente(this.paciente).subscribe(async response => {
          await this.showToast('Paciente actualizado exitosamente.');
          this.router.navigate(['/list-pacientes']);  // Volver a la lista de pacientes
        }, async error => {
          await this.showToast('Error al actualizar el paciente.', 'danger');
        });
      } else {
        // Agregar nuevo paciente
        this.servisioService.addPaciente(this.paciente).subscribe(async response => {
          await this.showToast('Paciente agregado exitosamente.');
          this.router.navigate(['/list-pacientes']);  // Volver a la lista de pacientes
        }, async error => {
          await this.showToast('Error al agregar el paciente.', 'danger');
        });
     
    }
  }

 

  // Verificar si el formulario es válido
  formValido(): boolean {
    return !!this.paciente.cedula && !!this.paciente.nom_usuario && !!this.paciente.ape_usuario && 
           !!this.paciente.telefono_usuario && !!this.paciente.email_usuario &&
           !!this.paciente.clave_usuario && !!this.confirmarClave && !this.claveNoCoincide;
  }

  // Verificar si el email es válido
  emailValido(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.paciente.email_usuario);
  }

  // Función para mostrar notificación (toast)
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Mostrar por 2 segundos
      position: 'bottom',
      color: color
    });
    toast.present();
  }
}
