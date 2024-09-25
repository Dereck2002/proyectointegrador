import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.page.html',
  styleUrls: ['./signos.page.scss'],
})
export class SignosPage implements OnInit {
  pacientes: any[] = [];
  filteredPacientes: any[] = []; 
  signos: any[] = [];
  selectedPaciente: number | null = null;
  editingSigno: any = null;  
  rol: string | null = ''; 
  searchTerm: string = '';  

  constructor(
    private servisioService: ServisioService,
    private alertController: AlertController,
    private toastController: ToastController  
  ) {}

  ngOnInit() {
    this.rol = localStorage.getItem('role');  
    if (this.rol === 'paciente') {
      this.loadSignosPaciente();  
    } else if (this.rol === 'medico') {
      this.loadPacientes();  
    }
  }

  loadPacientes() {
    this.servisioService.listPacientes().subscribe(response => {
      this.pacientes = response;
      this.filteredPacientes = [...this.pacientes];  
    }, error => {
      console.error('Error al cargar la lista de pacientes:', error);
    });
  }

  filterPacientes() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(paciente =>
      paciente.nom_usuario.toLowerCase().includes(searchTermLower) ||
      paciente.ape_usuario.toLowerCase().includes(searchTermLower)
    );
  }

  loadSignos() {
    if (this.selectedPaciente) {
      this.servisioService.listSignosByPaciente(this.selectedPaciente).subscribe(response => {
        this.signos = response;
      }, error => {
        console.error('Error al cargar los signos vitales:', error);
      });
    }
  }

  loadSignosPaciente() {
    const loggedUserData = this.servisioService.getLoggedUserData();
    const cod_usuario = loggedUserData?.cod_usuario;

    if (cod_usuario) {
      this.servisioService.listSignosByPaciente(cod_usuario).subscribe(response => {
        this.signos = response;
      }, error => {
        console.error('Error al cargar los signos vitales del paciente:', error);
      });
    }
  }

  // Función para editar un signo vital
  editSigno(signo: any) {
    this.editingSigno = { ...signo };  // Clonar el signo vital para editar
  }

  // Función para actualizar un signo vital
  updateSigno() {
    if (this.editingSigno) {
      this.servisioService.updateSigno(this.editingSigno).subscribe(async response => {
        console.log('Signo vital actualizado:', response);
        if (this.rol === 'paciente') {
          this.loadSignosPaciente();  // Recargar los signos vitales del paciente logueado
        } else {
          this.loadSignos();  // Recargar los signos vitales del paciente seleccionado (para el médico)
        }
        this.editingSigno = null;  // Limpiar el formulario
        await this.showToast('Signo vital actualizado exitosamente.');  
      }, async error => {
        console.error('Error al actualizar el signo vital:', error);
        await this.showToast('Error al actualizar el signo vital.', 'danger');  
      });
    }
  }

  // Función para eliminar un signo vital con confirmación
  async deleteSigno(cod_signos: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este signo vital?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada.');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.servisioService.deleteSigno(cod_signos).subscribe(async response => {
              console.log('Signo vital eliminado:', response);
              if (this.rol === 'paciente') {
                this.loadSignosPaciente();  // Recargar los signos vitales del paciente logueado
              } else {
                this.loadSignos();  // Recargar los signos vitales del paciente seleccionado (para el médico)
              }
              await this.showToast('Signo vital eliminado exitosamente.');  // Mostrar éxito
            }, async error => {
              console.error('Error al eliminar el signo vital:', error);
              await this.showToast('Error al eliminar el signo vital.', 'danger'); 
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  
      position: 'bottom',
      color: color 
    });
    toast.present();
  }
}
