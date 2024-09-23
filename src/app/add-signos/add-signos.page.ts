import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-signos',
  templateUrl: './add-signos.page.html',
  styleUrls: ['./add-signos.page.scss'],
})
export class AddSignosPage implements OnInit {
  signos = {
    precion: '',
    glucosa: '',
    peso: '',
    glicemia: '',
    pulso: '',
    temperatura: '',
    cod_usuario: null  // ID del paciente seleccionado o del usuario logueado
  };

  pacientes: any[] = [];  // Lista de pacientes (solo para médicos)
  role: string = '';  // Rol del usuario logueado

  constructor(private servisioService: ServisioService, private router: Router) {}

  ngOnInit() {
    // Obtener el rol del usuario logueado
    this.role = this.servisioService.getUserRole();  // Verifica si el usuario es 'medico' o 'paciente'

    if (this.role === 'medico') {
      // Si el usuario es médico, cargar la lista de pacientes
      this.servisioService.listPacientes().subscribe(response => {
        this.pacientes = response;  // Asignar la lista de pacientes
      });
    } else if (this.role === 'paciente') {
      // Si el usuario es paciente, obtener su ID automáticamente
      const loggedInUser = this.servisioService.getLoggedUserData();
      this.signos.cod_usuario = loggedInUser.cod_usuario;  // Asignar ID del paciente logueado
    }
  }

  submitSignos() {
    // Convertir los valores de signos vitales a números antes de enviarlos
    const signosData = {
      precion: parseInt(this.signos.precion, 10),
      glucosa: parseInt(this.signos.glucosa, 10),
      peso: parseInt(this.signos.peso, 10),
      glicemia: parseInt(this.signos.glicemia, 10),
      pulso: parseInt(this.signos.pulso, 10),
      temperatura: parseFloat(this.signos.temperatura), // Puede ser decimal
      cod_usuario: this.signos.cod_usuario  // Paciente seleccionado o logueado
    };

    // Enviar los signos vitales al servicio
    this.servisioService.addSignos(signosData).subscribe(response => {
      console.log('Signos vitales añadidos', response);
      this.router.navigate(['/signos']);  // Redirigir a otra página después de agregar los signos
    });
  }
}
