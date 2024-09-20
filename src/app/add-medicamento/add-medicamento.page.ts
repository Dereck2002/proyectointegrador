import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-medicamento',
  templateUrl: './add-medicamento.page.html',
  styleUrls: ['./add-medicamento.page.scss'],
})
export class AddMedicamentoPage implements OnInit {
  medicamento = {
    medicamento: '',
    dosis: '',
    tiempo: '',
    cod_usuario: null as number | null, // Paciente seleccionado
    cod_medico: null as number | null   // Médico logueado
  };

  pacientes: any[] = [];  // Lista de pacientes

  constructor(private servisioService: ServisioService, private router: Router) {}

  ngOnInit() {
    // Cargar la lista de pacientes
    this.loadPacientes();

    // Asignar el ID del médico logueado
    const codMedico = localStorage.getItem('cod_medico');
    if (codMedico) {
      this.medicamento.cod_medico = parseInt(codMedico, 10);
    } else {
      console.error('Error: No se encontró cod_medico en el localStorage.');
    }
  }

  // Función para cargar la lista de pacientes
  loadPacientes() {
    this.servisioService.listPatients().subscribe(response => {
      this.pacientes = response;
    }, error => {
      console.error('Error al cargar la lista de pacientes:', error);
    });
  }

  // Enviar el medicamento
  submitMedicamento() {
    // Verificar si todos los campos están completos
    if (!this.medicamento.medicamento || !this.medicamento.dosis || !this.medicamento.tiempo || !this.medicamento.cod_usuario) {
      console.error('Por favor, completa todos los campos.');
      return;
    }

    // Enviar los datos al backend
    this.servisioService.addMedicamento(this.medicamento).subscribe(response => {
      console.log('Medicamento añadido:', response);
      this.router.navigate(['/menu']);  // Navegar al menú después de guardar
    }, error => {
      console.error('Error al enviar el medicamento:', error);
    });
  }
}
