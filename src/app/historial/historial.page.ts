import { Component, OnInit } from '@angular/core';
import { ServisioService } from '../servisio/servisio.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  mensajes: any[] = [];
  rol: string = '';  // Rol del usuario ('medico' o 'paciente')
  userId: number = 0;  // ID del usuario logueado

  constructor(private servisioService: ServisioService) {}

  ngOnInit() {
    // Obtener el rol y el ID del usuario logueado desde el localStorage
    this.rol = localStorage.getItem('rol') || '';
    if (this.rol === 'medico') {
      this.userId = parseInt(localStorage.getItem('cod_medico')!, 10);
    } else if (this.rol === 'paciente') {
      this.userId = parseInt(localStorage.getItem('cod_usuario')!, 10);
    }

    // Cargar el historial de mensajes
    this.loadMensajes();
  }

  // Cargar los mensajes del usuario logueado
  loadMensajes() {
    this.servisioService.listMensajes(this.userId, this.rol).subscribe(response => {
      this.mensajes = response;
    });
  }
}
