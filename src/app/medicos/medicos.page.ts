import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.page.html',
  styleUrls: ['./medicos.page.scss'],
})
export class MedicosPage implements OnInit {
  mostrarContrasena = false;
  medico = {
    cedula: '',
    nom_medico: '',
    ape_medico: '',
    telefono_medico: '',
    email_medico: '',
    clave_medico: '',
    espe_medico: ''
  };
  editingMedico: any = null;  // Médico que se está editando

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Si hay un médico pasado desde la lista, cargarlo para editar
    const state = history.state;
    if (state.medico) {
      this.medico = { ...state.medico };
      this.editingMedico = state.medico;
    }
  }

  // Función para agregar o actualizar un médico
  submitMedico() {
    if (this.editingMedico) {
      // Actualizar médico
      this.servisioService.updateMedico(this.medico).subscribe(async response => {
        await this.showToast('Médico actualizado exitosamente.');
        this.router.navigate(['/list-medicos']);  // Volver a la lista de médicos
      }, async error => {
        await this.showToast('Error al actualizar el médico.', 'danger');
      });
    } else {
      // Agregar nuevo médico
      this.servisioService.addMedico(this.medico).subscribe(async response => {
        await this.showToast('Médico agregado exitosamente.');
        this.router.navigate(['/list-medicos']);  // Volver a la lista de médicos
      }, async error => {
        await this.showToast('Error al agregar el médico.', 'danger');
      });
    }
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Mostrar por 2 segundos
      position: 'bottom',
      color: color
    });
    toast.present();
  }
  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
