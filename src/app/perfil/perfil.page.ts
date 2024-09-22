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
  usuario: any = {};  // Aquí se almacenan los datos del usuario, médico o administrador
  selectedFile: File | null = null;  // Imagen seleccionada
  rol: string | null = ''; // Rol del usuario ('medico', 'paciente', o 'administrador')

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.rol = localStorage.getItem('role');  // Obtener el rol del localStorage

    // Obtener los datos del usuario logueado
    const loggedUserData = this.servisioService.getLoggedUserData();
    
    // Depurar para verificar si loggedUserData contiene el ID del usuario
    console.log('Logged User Data:', loggedUserData);
    
    const id = this.rol === 'medico'
      ? loggedUserData?.cod_medico
      : this.rol === 'administrador'
      ? loggedUserData?.cod_admin
      : loggedUserData?.cod_usuario;

    if (id) {
      this.loadPerfil(id);  // Cargar el perfil del médico, administrador o paciente
    } else {
      this.showToast('No se encontró el ID del usuario.', 'danger');
    }
  }

  // Función para cargar el perfil dependiendo del rol
  loadPerfil(id: number) {
    if (this.rol === 'medico') {
      this.servisioService.getPerfilMedico(id).subscribe((response) => {
        this.usuario = response;
      });
    } else if (this.rol === 'administrador') {
      this.servisioService.getPerfilAdministrador(id).subscribe((response) => {
        this.usuario = response;
      });
    } else {
      this.servisioService.getPerfil(id).subscribe((response) => {
        this.usuario = response;
      });
    }
  }

  // Manejar la selección de archivos
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Actualizar el perfil con imagen y datos
  updateProfile() {
    const formData = new FormData();
    const userId = this.rol === 'medico'
      ? this.usuario.cod_medico
      : this.rol === 'administrador'
      ? this.usuario.cod_admin
      : this.usuario.cod_usuario;

    formData.append('id', userId);
    formData.append('rol', this.rol as string);
    formData.append('nombre', this.usuario.nom_usuario);
    formData.append('apellido', this.usuario.ape_usuario);
    formData.append('telefono', this.usuario.telefono_usuario);
    formData.append('email', this.usuario.email_usuario);
    formData.append('clave', this.usuario.clave_usuario);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    // Enviar la solicitud al backend
    this.servisioService.updateProfileWithImage(formData).subscribe(
      async (response) => {
        await this.showToast('Perfil actualizado correctamente.');
        this.loadPerfil(userId); // Recargar el perfil
      },
      async (error) => {
        await this.showToast('Error al actualizar el perfil.', 'danger');
      }
    );
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
