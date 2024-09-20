import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';

@Component({
  selector: 'app-list-pacientes',
  templateUrl: './list-pacientes.page.html',
  styleUrls: ['./list-pacientes.page.scss'],
})
export class ListPacientesPage implements OnInit {
  patients: any[] = [];

  constructor(private servisioService: ServisioService) { }

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.servisioService.listPatients().subscribe(data => {
      this.patients = data;
    });
  }

  editPatient(patient: any) {
    // Lógica para redirigir a la edición del paciente
  }

  deletePatient(id: number) {
    this.servisioService.deletePatient(id).subscribe(() => {
      this.loadPatients();
    });
  }
}
