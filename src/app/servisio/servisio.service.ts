import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServisioService {

  private API_URL = 'http://localhost/proyectointegrador/mpaciente/mpacientes.php';
  private currentRole: string | null = null;

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}?action=login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Guardar rol del usuario
  storeUserRole(role: string) {
    this.currentRole = role;
    localStorage.setItem('role', role);
  }

  // Obtener rol del usuario
  getUserRole(): string | null {
    if (this.currentRole) {
      return this.currentRole;
    } else {
      return localStorage.getItem('role');
    }
  }

  // Listar pacientes
  listPatients(): Observable<any> {
    return this.http.get(`${this.API_URL}?action=listPatients`);
  }

  // Agregar paciente
  addPatient(patient: any): Observable<any> {
    return this.http.post(`${this.API_URL}?action=addPatient`, patient, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Editar paciente
  editPatient(patient: any): Observable<any> {
    return this.http.put(`${this.API_URL}?action=editPatient`, patient, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  addSignos(signos: any): Observable<any> {
    return this.http.post(`${this.API_URL}?action=addSignos`, signos, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  

  // Eliminar paciente
  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}?action=deletePatient`, {
      body: { id: id },
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

 // Método para agregar un medicamento
addMedicamento(medicamento: any): Observable<any> {
  return this.http.post(`${this.API_URL}?action=addMedicamento`, medicamento, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  });
}

// Obtener lista de pacientes
listPacientes(): Observable<any> {
  return this.http.get(`${this.API_URL}?action=listPacientes`);
}

// Obtener lista de médicos
listMedicos(): Observable<any> {
  return this.http.get(`${this.API_URL}?action=listMedicos`);
}

// Enviar mensaje
enviarMensaje(mensaje: any): Observable<any> {
  return this.http.post(`${this.API_URL}?action=sendMessage`, mensaje, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  });
}

listMensajes(userId: number, role: string): Observable<any> {
  return this.http.get(`${this.API_URL}?action=listMessages&user_id=${userId}&role=${role}`);
}

  // Obtener los mensajes para un usuario específico
  getMensajes(userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}?action=listMessages&user_id=${userId}`);
  }
}

