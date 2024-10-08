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
  showPassword: boolean = false;  

  constructor(
    private servisioService: ServisioService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    if (this.username && this.password) {
      this.servisioService.login({ username: this.username, password: this.password }).subscribe(
        async (response: any) => {
          console.log('Login response:', response);  // Verificar el contenido de la respuesta
          if (response.success) {
            let userData: any;
            if (response.role === 'medico') {
              userData = { cod_medico: response.cod_medico };
            } else if (response.role === 'paciente') {
              userData = { cod_usuario: response.cod_usuario };
            } else if (response.role === 'administrador') {
              // Asegurarse de que el ID del administrador no sea null
              if (response.cod_admin) {
                userData = { cod_admin: response.cod_admin };
              } else {
                console.error('No se recibió el ID de administrador');
              }
            }
  
            // Guardar los datos del rol y el ID en el almacenamiento
            if (userData) {
              this.servisioService.storeUserRoleAndData(response.role, userData);
              await this.showToast('Inicio de sesión exitoso.');
              this.router.navigate(['/menu']);
            }
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
 
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  
      position: 'bottom'
    });
    toast.present();
  }

  // Función para redirigir a la página de recuperación de contraseña
  recoverPassword() {
    this.router.navigate(['/reset-password']);
  }

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;  // Alterna correctamente el valor de showPassword
  }
}
