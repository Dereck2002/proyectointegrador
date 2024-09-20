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
  signos: any[] = [];
  selectedPaciente: number | null = null;
  editingSigno: any = null;  // Signo vital que se está editando

  constructor(
    private servisioService: ServisioService,
    private alertController: AlertController,
    private toastController: ToastController  // Para mostrar notificaciones
  ) {}

  ngOnInit() {
    this.loadPacientes();  // Cargar la lista de pacientes al inicio
  }

  // Cargar la lista de pacientes
  loadPacientes() {
    this.servisioService.listPacientes().subscribe(response => {
      this.pacientes = response;
    }, error => {
      console.error('Error al cargar la lista de pacientes:', error);
    });
  }

  // Cargar los signos vitales del paciente seleccionado
  loadSignos() {
    if (this.selectedPaciente) {
      this.servisioService.listSignosByPaciente(this.selectedPaciente).subscribe(response => {
        this.signos = response;
      }, error => {
        console.error('Error al cargar los signos vitales:', error);
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
        this.loadSignos();  // Recargar la lista de signos vitales
        this.editingSigno = null;  // Limpiar el formulario
        await this.showToast('Signo vital actualizado exitosamente.');  // Mostrar éxito
      }, async error => {
        console.error('Error al actualizar el signo vital:', error);
        await this.showToast('Error al actualizar el signo vital.', 'danger');  // Mostrar error
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
              this.loadSignos();  // Recargar la lista de signos vitales
              await this.showToast('Signo vital eliminado exitosamente.');  // Mostrar éxito
            }, async error => {
              console.error('Error al eliminar el signo vital:', error);
              await this.showToast('Error al eliminar el signo vital.', 'danger');  // Mostrar error
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para mostrar un mensaje toast
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Mostrar por 2 segundos
      position: 'bottom',
      color: color  // 'success' para éxito, 'danger' para error
    });
    toast.present();
  }
}
