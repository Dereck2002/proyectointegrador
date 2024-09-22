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
  medico = {
    cedula: '',
    nom_medico: '',
    ape_medico: '',
    telefono_medico: '',
    email_medico: '',
    clave_medico: '',
    espe_medico: '',
    rol: 'medico'  // Valor por defecto 'medico'
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
    // Validar campos antes de enviar
    if (!this.medico.cedula || !this.medico.nom_medico || !this.medico.ape_medico || 
        !this.medico.telefono_medico || !this.medico.email_medico || !this.medico.clave_medico || 
        !this.medico.espe_medico || !this.medico.rol) {
      this.showToast('Por favor, completa todos los campos obligatorios.', 'danger');
      return;
    }

    // Agregar o actualizar médico
    if (this.editingMedico) {
      // Actualizar médico
      this.servisioService.updateMedico(this.medico).subscribe(async response => {
        await this.showToast('Médico actualizado exitosamente.');
        this.router.navigate(['/list-medicos']);  // Volver a la lista de médicos
      }, async error => {
        await this.showToast('Error al actualizar el médico.', 'danger');
        console.error('Error al actualizar:', error);
      });
    } else {
      this.servisioService.addMedico(this.medico).subscribe(async (response: any) => {
        if (response && response.message) {
          await this.showToast(response.message);
        } else {
          await this.showToast('Ocurrió un error inesperado.', 'danger');
        }
      }, async error => {
        await this.showToast('Error de conexión con el servidor.', 'danger');
        console.error('Error al agregar:', error);
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
