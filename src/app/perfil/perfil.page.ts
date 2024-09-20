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
  usuario: any = {};  // Aquí se almacenan los datos del usuario o médico
  selectedFile: File | null = null;  // Imagen seleccionada
  rol: string | null = ''; // Rol del usuario ('medico' o 'paciente')
  

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');  // Obtener el rol del localStorage
    const id = this.rol === 'medico' ? parseInt(localStorage.getItem('cod_medico') ?? '0', 10) 
                                     : parseInt(localStorage.getItem('cod_usuario') ?? '0', 10);
    if (id !== 0) {
      this.loadPerfil(id);  // Cargar el perfil del médico o paciente
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
    formData.append('id', this.rol === 'medico' ? this.usuario.cod_medico : this.usuario.cod_usuario);
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
        this.loadPerfil(this.usuario.cod_usuario || this.usuario.cod_medico); // Recargar el perfil
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
  csesion(){
    this.navCtrl.navigateRoot('/home');
  }
}
