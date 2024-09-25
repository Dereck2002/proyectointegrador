import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = null;  // Iniciar como null para evitar errores al acceder antes de cargar
  rol: string | null = ''; // Rol del usuario ('medico', 'paciente', o 'administrador')

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.rol = localStorage.getItem('role');  // Obtener el rol del localStorage
    
    // Obtener los datos del usuario logueado desde el localStorage
    const loggedUserData = this.servisioService.getLoggedUserData();
    
    // Depurar para verificar si loggedUserData contiene el ID del administrador, médico o paciente
    console.log('Logged User Data:', loggedUserData);
    
    const id = this.rol === 'medico'
      ? loggedUserData?.cod_medico
      : this.rol === 'administrador'
      ? loggedUserData?.cod_admin  // Obtener el ID de administrador
      : loggedUserData?.cod_usuario;

    if (id) {
      this.loadPerfil(id);  // Cargar el perfil del administrador, médico o paciente
    } else {
      this.showToast('No se encontró el ID del usuario.', 'danger');
    }
  }

  // Función para cargar el perfil dependiendo del rol
  loadPerfil(id: number) {
    if (this.rol === 'medico') {
      this.servisioService.getPerfilMedico(id).subscribe(
        (response) => {
          this.usuario = response;
          console.log('Datos del médico cargados:', response);
        },
        (error) => {
          this.showToast('Error al cargar el perfil del médico.', 'danger');
        }
      );
    } else if (this.rol === 'administrador') {
      // Lógica para administrador (similar al médico)
      this.servisioService.getPerfilAdministrador(id).subscribe(
        (response) => {
          this.usuario = response;
          console.log('Datos del administrador cargados:', response);
        },
        (error) => {
          this.showToast('Error al cargar el perfil del administrador.', 'danger');
        }
      );
    } else {
      this.servisioService.getPerfil(id).subscribe(
        (response) => {
          this.usuario = response;
          console.log('Datos del usuario cargados:', response);
        },
        (error) => {
          this.showToast('Error al cargar el perfil del usuario.', 'danger');
        }
      );
    }
  }

  // Actualizar el perfil con los datos cargados
  updateProfile() {
    if (this.usuario) {
      const userId = this.rol === 'medico'
        ? this.usuario.cod_medico
        : this.rol === 'administrador'
        ? this.usuario.cod_admin
        : this.usuario.cod_usuario;

      // Actualizar datos del usuario en el backend 
      this.servisioService.updatePerfil(this.usuario).subscribe(
        async (response) => {
          await this.showToast('Perfil actualizado correctamente.');
          this.loadPerfil(userId);  // Recargar el perfil
        },
        async (error) => {
          await this.showToast('Error al actualizar el perfil.', 'danger');
        }
      );
    } else {
      this.showToast('No se ha podido cargar el perfil.', 'danger');
    }
  }

  // Mostrar un mensaje (toast)
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }

  // Cerrar sesión y volver al login
  csesion() {
    this.navCtrl.navigateRoot('/home');
  }
}
