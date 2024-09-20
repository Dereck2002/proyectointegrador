import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.page.html',
  styleUrls: ['./medicamentos.page.scss'],
})
export class MedicamentosPage implements OnInit {
  pacientes: any[] = [];
  medicamentos: any[] = [];
  selectedPaciente: number | null = null;
  editingMedicamento: any = null;  // Medicamento que se está editando
  navCtrl: any;

  constructor(private servisioService: ServisioService, private toastController: ToastController) {}

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

  // Cargar los medicamentos del paciente seleccionado
  loadMedicamentos() {
    if (this.selectedPaciente) {
      this.servisioService.listMedicamentosByPaciente(this.selectedPaciente).subscribe(response => {
        console.log('Medicamentos recibidos del servidor:', response);  // Verifica lo que llega desde el servidor
        this.medicamentos = response;
      }, error => {
        console.error('Error al cargar los medicamentos:', error);
      });
    }
  }

  // Función para editar un medicamento
  editMedicamento(medicamento: any) {
    this.editingMedicamento = { ...medicamento };  // Clonar el medicamento para editar
  }

  // Función para actualizar el medicamento
  updateMedicamento() {
    if (this.editingMedicamento) {
      this.servisioService.updateMedicamento(this.editingMedicamento).subscribe(response => {
        console.log('Medicamento actualizado:', response);
        this.loadMedicamentos();  // Recargar la lista de medicamentos
        this.editingMedicamento = null;  // Limpiar el formulario
      }, error => {
        console.error('Error al actualizar el medicamento:', error);
      });
    }
  }

  // Función para eliminar un medicamento
  deleteMedicamento(cod_medicina: number) {
    this.servisioService.deleteMedicamento(cod_medicina).subscribe(response => {
      console.log('Medicamento eliminado:', response);
      this.loadMedicamentos();  // Recargar la lista de medicamentos
    }, error => {
      console.error('Error al eliminar el medicamento:', error);
    });
  }
 
}
