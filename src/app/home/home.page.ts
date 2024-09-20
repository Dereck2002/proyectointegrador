import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private servisioService: ServisioService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    if (this.username && this.password) {
      this.servisioService.login({ username: this.username, password: this.password }).subscribe(
        async (response: any) => {
          if (response.success) {
            // Guardar el rol en el localStorage
            localStorage.setItem('rol', response.role);  // 'medico' o 'paciente'
  
            // Guardar el cod_medico o cod_usuario dependiendo del rol
            if (response.role === 'medico') {
              localStorage.setItem('cod_medico', response.cod_medico);  // Guardar el ID del médico
              localStorage.removeItem('cod_usuario');  // Asegurarse de eliminar el ID del paciente si está guardado
            } else if (response.role === 'paciente') {
              localStorage.setItem('cod_usuario', response.cod_usuario);  // Guardar el ID del paciente
              localStorage.removeItem('cod_medico');  // Asegurarse de eliminar el ID del médico si está guardado
            }
  
            // Mostrar mensaje de éxito y redirigir
            await this.showToast('Inicio de sesión exitoso.');
            this.router.navigate(['/menu']);
          } else {
            this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
          }
        },
        (error) => {
          this.errorMessage = 'Ocurrió un error al procesar la solicitud.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, ingrese su usuario y contraseña.';
    }
  }
  // Función para mostrar un mensaje toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // El mensaje se mostrará por 2 segundos
      position: 'bottom'
    });
    toast.present();
  }
}
