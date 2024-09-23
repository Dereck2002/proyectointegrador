import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-medicamentosp',
  templateUrl: './medicamentosp.page.html',
  styleUrls: ['./medicamentosp.page.scss'],
})
export class MedicamentospPage implements OnInit {
  medicamentos: any[] = [];  // Lista completa de medicamentos
  filteredMedicamentos: any[] = [];  // Lista filtrada de medicamentos
  searchTerm: string = '';  // Término de búsqueda

  constructor(
    private servisioService: ServisioService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadMedicamentos();
  }

  // Cargar los medicamentos del paciente
  loadMedicamentos() {
    const loggedUser = this.servisioService.getLoggedUserData();  // Obtener los datos del usuario logueado
    const cod_usuario = loggedUser.cod_usuario;

    if (cod_usuario) {
      this.servisioService.listMedicamentosByPaciente(cod_usuario).subscribe(response => {
        if (response.length > 0) {
          this.medicamentos = response;
          this.filteredMedicamentos = [...this.medicamentos];  // Inicialmente, mostrar todos los medicamentos
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

  // Filtrar medicamentos según el término de búsqueda
  filterMedicamentos() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredMedicamentos = this.medicamentos.filter(medicamento =>
      medicamento.medicamento.toLowerCase().includes(searchTermLower) ||
      medicamento.dosis.toLowerCase().includes(searchTermLower)
    );
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
