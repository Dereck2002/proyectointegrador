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
    cod_usuario: 1 // Asegúrate de manejar correctamente el ID del usuario logueado.
  };

  constructor(private servisioService: ServisioService, private router: Router) {}

  submitSignos() {
    // Convertir los valores a números antes de enviarlos
    const signosData = {
      precion: parseInt(this.signos.precion, 10),
      glucosa: parseInt(this.signos.glucosa, 10),
      peso: parseInt(this.signos.peso, 10),
      glicemia: parseInt(this.signos.glicemia, 10),
      pulso: parseInt(this.signos.pulso, 10),
      temperatura: parseFloat(this.signos.temperatura), // Temperatura puede ser decimal
      cod_usuario: this.signos.cod_usuario
    };

    this.servisioService.addSignos(signosData).subscribe(response => {
      console.log('Signos vitales añadidos', response);
      this.router.navigate(['/menu']);
    });
  }
}
