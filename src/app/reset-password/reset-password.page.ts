import { Component } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  cedula: string = '';
  email: string = '';
  newPassword: string = '';

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController
  ) {}

  async resetPassword() {
    // Validación de campos vacíos
    if (!this.cedula || !this.email || !this.newPassword) {
      await this.showToast('Por favor, complete todos los campos.');
      return;
    }

    // Datos a enviar al servicio
    const data = {
      cedula: this.cedula,
      email: this.email,
      new_password: this.newPassword
    };

    // Llamada al servicio de recuperación de contraseña
    this.servisioService.resetPassword(data).subscribe(
      async (response: any) => {
        if (response && response.message) {
          await this.showToast(response.message);
        } else {
          await this.showToast('Error inesperado. Inténtelo nuevamente.');
        }
      },
      async (error) => {
        // Muestra un mensaje de error en caso de fallo
        if (error.error && error.error.message) {
          await this.showToast(error.error.message);
        } else {
          await this.showToast('Error al restablecer la contraseña.');
        }
        console.error('Error:', error);
      }
    );
  }

  // Función para mostrar mensajes de Toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
