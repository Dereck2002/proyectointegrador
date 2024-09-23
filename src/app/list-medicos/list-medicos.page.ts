import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-medicos',
  templateUrl: './list-medicos.page.html',
  styleUrls: ['./list-medicos.page.scss'],
})
export class ListMedicosPage implements OnInit {
  medicos: any[] = [];
  filteredMedicos: any[] = []; // Médicos filtrados por el buscador
  searchTerm: string = ''; // Término de búsqueda

  constructor(
    private servisioService: ServisioService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMedicos();
  }

  // Cargar la lista de médicos
  loadMedicos() {
    this.servisioService.listMedicos().subscribe(data => {
      this.medicos = data;
      this.filteredMedicos = [...this.medicos]; // Inicialmente, mostrar todos los médicos
    }, error => {
      console.error('Error al cargar la lista de médicos:', error);
    });
  }

  // Filtrar los médicos según el término de búsqueda
  filterMedicos() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredMedicos = this.medicos.filter(medico =>
      medico.nom_medico.toLowerCase().includes(searchTermLower) ||
      medico.ape_medico.toLowerCase().includes(searchTermLower)
    );
  }

  // Función para editar un médico
  editMedico(medico: any) {
    this.router.navigate(['/medicos'], { state: { medico } }); // Redirige con los datos del médico
  }

  // Función para eliminar un médico con confirmación
  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este médico?',
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
            this.deleteMedico(id);
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para eliminar un médico
  deleteMedico(id: number) {
    this.servisioService.deleteMedico(id).subscribe(async () => {
      this.loadMedicos(); // Recargar la lista de médicos
      await this.showToast('Médico eliminado exitosamente.');
    }, async error => {
      await this.showToast('Error al eliminar el médico.', 'danger');
    });
  }

  // Función para mostrar notificación (toast)
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Mostrar por 2 segundos
      position: 'bottom',
      color: color
    });
    toast.present();
  }
}
