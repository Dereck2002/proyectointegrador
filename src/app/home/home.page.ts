import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServisioService } from '../servisio/servisio.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private servisioService: ServisioService, private router: Router) {}

  login() {
    if (this.username && this.password) {
      this.servisioService.login({ username: this.username, password: this.password }).subscribe(
        (response: any) => {
          if (response.success) {
            this.servisioService.storeUserRole(response.role);
            this.router.navigate(['/menu']);
          } else {
            this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
          }
        },
        (error) => {
          this.errorMessage = 'Ocurrió un error al procesar la solicitud.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, ingrese su usuario y contraseña.';
    }
  }
}