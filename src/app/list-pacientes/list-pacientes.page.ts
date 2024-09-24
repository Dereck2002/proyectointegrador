import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pacientes',
  templateUrl: './list-pacientes.page.html',
  styleUrls: ['./list-pacientes.page.scss'],
})
export class ListPacientesPage implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchTerm: string = '';

  constructor(
    private servisioService: ServisioService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  // Cargar la lista de pacientes
  loadPatients() {
    this.servisioService.listPacientes().subscribe(data => {
      this.patients = data;
      this.filteredPatients = [...this.patients]; // Inicialmente, mostrar todos los pacientes
    }, error => {
      console.error('Error al cargar la lista de pacientes:', error);
    });
  }

  // Filtrar pacientes por el término de búsqueda
  filterPatients() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.nom_usuario.toLowerCase().includes(searchTermLower) ||
      patient.ape_usuario.toLowerCase().includes(searchTermLower) ||
      patient.cedula.toLowerCase().includes(searchTermLower)
    );
  }

  // Función para editar un paciente
  editPatient(patient: any) {
    this.router.navigate(['/ac-pacientes'], { state: { patient } });  // Redirige con los datos del paciente
  }

  // Función para eliminar un paciente con confirmación
  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este paciente?',
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
            this.deletePatient(id);
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para eliminar un paciente
  deletePatient(id: number) {
    this.servisioService.deletePatient(id).subscribe(async () => {
      this.loadPatients();  // Recargar la lista de pacientes
      await this.showToast('Paciente eliminado exitosamente.');
    }, async error => {
      await this.showToast('Error al eliminar el paciente.', 'danger');
    });
  }

  // Función para mostrar notificación (toast)
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Mostrar por 2 segundos
      position: 'bottom',
      color: color
    });
    toast.present();
  }
}
