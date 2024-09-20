import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-medicamentosp',
  templateUrl: './medicamentosp.page.html',
  styleUrls: ['./medicamentosp.page.scss'],
})
export class MedicamentospPage implements OnInit {
  medicamentos: any[] = [];  // Aquí almacenaremos los medicamentos

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadMedicamentos();
  }

  // Cargar los medicamentos del paciente
  loadMedicamentos() {
    const cod_usuario = localStorage.getItem('cod_usuario');  // Obtener el ID del paciente

    if (cod_usuario) {
      const parsedCodUsuario = parseInt(cod_usuario, 10);
      this.servisioService.listMedicamentosByPaciente(parsedCodUsuario).subscribe(response => {
        if (response.length > 0) {
          this.medicamentos = response;
        } else {
          this.showToast('No se encontraron medicamentos.');
        }
      }, error => {
        console.error('Error al cargar los medicamentos:', error);
        this.showToast('Error al cargar los medicamentos.');
      });
    } else {
      this.showToast('No se encontró el ID del paciente.');
    }
  }

  // Mostrar mensajes (toasts)
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
