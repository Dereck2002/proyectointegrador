import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
})
export class PacientesPage implements OnInit {
  paciente = {
    cedula: '',
    nom_usuario: '',
    ape_usuario: '',
    telefono_usuario: '',
    email_usuario: '',
    clave_usuario: ''
  };
  editingPaciente: any = null;  // Paciente que se está editando

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Si hay un paciente pasado desde la lista, cargarlo para editar
    const state = history.state;
    if (state.patient) {
      this.paciente = { ...state.patient };
      this.editingPaciente = state.patient;
    }
  }

  // Función para agregar o actualizar un paciente
  submitPaciente() {
    if (this.editingPaciente) {
      // Actualizar paciente
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
