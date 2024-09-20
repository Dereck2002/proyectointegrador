import { Component } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-signos',
  templateUrl: './add-signos.page.html',
  styleUrls: ['./add-signos.page.scss'],
})
export class AddSignosPage {
  signos = {
    precion: '',
    glucosa: '',
    peso: '',
    glicemia: '',
    pulso: '',
    temperatura: '',
    cod_usuario: 1 // O el ID del paciente que estés manejando
  };

  constructor(private servisioService: ServisioService, private router: Router) {}

  submitSignos() {
    this.servisioService.addSignos(this.signos).subscribe(response => {
      console.log('Signos vitales añadidos', response);
      this.router.navigate(['/list-pacientes']);
    });
  }
}
