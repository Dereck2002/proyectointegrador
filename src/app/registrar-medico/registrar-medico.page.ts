import { Component } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-medico',
  templateUrl: './registrar-medico.page.html',
  styleUrls: ['./registrar-medico.page.scss'],
})
export class RegistrarMedicoPage {
  medico: any = {
    cedula: '',
    nom_medico: '',
    ape_medico: '',
    telefono_medico: '',
    email_medico: '',
    clave_medico: '',
    espe_medico: ''
  };
  selectedFile: File | null = null;

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController,
    private router: Router
  ) {}

  // Función para manejar la selección de archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Función para registrar al médico
  registerMedico() {
    const formData = new FormData();
    formData.append('cedula', this.medico.cedula);
    formData.append('nom_medico', this.medico.nom_medico);
    formData.append('ape_medico', this.medico.ape_medico);
    formData.append('telefono_medico', this.medico.telefono_medico);
    formData.append('email_medico', this.medico.email_medico);
    formData.append('clave_medico', this.medico.clave_medico);
    formData.append('espe_medico', this.medico.espe_medico);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    // Llamar al servicio para registrar al médico
    this.servisioService.registerMedico(formData).subscribe(
      async (response: any) => {
        if (response.success) {
          await this.showToast('Médico registrado exitosamente.');
          this.router.navigate(['/menu']);
        } else {
          await this.showToast('Error al registrar al médico.');
        }
      },
      async (error) => {
        await this.showToast('Error de servidor.');
        console.error('Error al registrar médico:', error);
      }
    );
  }

  // Función para mostrar mensajes toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
