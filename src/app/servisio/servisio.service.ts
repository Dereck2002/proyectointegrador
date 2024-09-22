import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServisioService {

  private API_URL = 'http://localhost/proyectointegrador/mpaciente/mpacientes.php';
  private currentRole: string | null = null;
  private loggedInUserData: any = null;  // Almacenar datos del usuario logueado

  constructor(private http: HttpClient) {}

  // Obtener el rol del usuario logueado
  getUserRole(): string {
    return this.currentRole || localStorage.getItem('role') || '';  // Devolver el rol almacenado o una cadena vacía
  }

  // Guardar el rol y los datos del usuario logueado
  storeUserRoleAndData(role: string, userData: any) {
    this.currentRole = role;
    this.loggedInUserData = userData;

    // Almacenar en localStorage tanto el rol como los datos del usuario
    localStorage.setItem('role', role);
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
  }

  // Obtener los datos del usuario logueado
  getLoggedUserData(): any {
    if (this.loggedInUserData) {
      return this.loggedInUserData;
    } else {
      const storedUser = localStorage.getItem('loggedInUser');
      return storedUser ? JSON.parse(storedUser) : null;  // Devolver los datos del usuario almacenados
    }
  }

  // Obtener el perfil del paciente
  getPerfil(cod_usuario: number): Observable<any> {
    return this.http.get(`${this.API_URL}?action=getPerfil&cod_usuario=${cod_usuario}`);
  }

  // Obtener el perfil del doctor
  getPerfilMedico(cod_medico: number): Observable<any> {
    return this.http.get(`${this.API_URL}?action=getPerfilMedico&cod_medico=${cod_medico}`);
  }

  // Obtener el perfil del administrador
  getPerfilAdministrador(cod_admin: number): Observable<any> {
    return this.http.get(`${this.API_URL}?action=getPerfilAdmin&cod_admin=${cod_admin}`);
  }

  // Actualizar perfil
  updatePerfil(usuario: any): Observable<any> {
    return this.http.put(`${this.API_URL}?action=updatePerfil`, usuario, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

 addMedico(medico: any): Observable<any> {
  return this.http.post(`${this.API_URL}?action=addMedico`, medico, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Asegúrate de que sea JSON
  });
}

updateMedico(medico: any): Observable<any> {
  return this.http.put(`${this.API_URL}?action=updateMedico`, medico, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Asegúrate de que sea JSON
  });
}

   // Método para iniciar sesión
   resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}?action=resetPassword`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

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


  // Obtener lista de pacientes
  listPacientes(): Observable<any> {
    return this.http.get(`${this.API_URL}?action=listPacientes`);
  }

  // Agregar un nuevo paciente
  addPaciente(paciente: any): Observable<any> {
    return this.http.post(`${this.API_URL}?action=addPatient`, paciente, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Actualizar un paciente existente
  updatePaciente(paciente: any): Observable<any> {
    return this.http.put(`${this.API_URL}?action=editPatient`, paciente, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  addSignos(signos: any): Observable<any> {
    return this.http.post(`${this.API_URL}?action=addSignos`, signos, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

   // Obtener signos vitales para un paciente específico
   listSignosByPaciente(cod_usuario: number): Observable<any> {
    return this.http.get(`${this.API_URL}?action=listSignos&cod_usuario=${cod_usuario}`);
  }

  // Actualizar un signo vital
  updateSigno(signo: any): Observable<any> {
    return this.http.put(`${this.API_URL}?action=updateSigno`, signo, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Eliminar un signo vital
  deleteSigno(cod_signos: number): Observable<any> {
    return this.http.delete(`${this.API_URL}?action=deleteSigno&cod_signos=${cod_signos}`);
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

// Actualizar mensaje
updateMensaje(id: number, mensaje: string): Observable<any> {
  const payload = { id, mensaje };
  return this.http.put(`${this.API_URL}?action=updateMensaje`, payload, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  });
}

// Eliminar mensaje
deleteMensaje(id: number): Observable<any> {
  const payload = { id };
  return this.http.delete(`${this.API_URL}?action=deleteMensaje`, {
    body: payload,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  });
}

 // Obtener mensajes de un usuario
 listMensajes(userId: number, role: string): Observable<any> {
  return this.http.get(`${this.API_URL}?action=listMessages&user_id=${userId}&role=${role}`);
}



  // Obtener los mensajes para un usuario específico
  getMensajes(userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}?action=listMessages&user_id=${userId}`);
  }

  //medicamento
  // Obtener medicamentos para un paciente específico
  listMedicamentosByPaciente(cod_usuario: number): Observable<any> {
    return this.http.get(`${this.API_URL}?action=listMedicamentos&cod_usuario=${cod_usuario}`);
  }

  // Actualizar un medicamento
  updateMedicamento(medicamento: any): Observable<any> {
    return this.http.put(`${this.API_URL}?action=updateMedicamento`, medicamento, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Eliminar un medicamento
  deleteMedicamento(cod_medicina: number): Observable<any> {
    return this.http.delete(`${this.API_URL}?action=deleteMedicamento&cod_medicina=${cod_medicina}`);
  }

  // Actualizar el perfil con imagen
  updateProfileWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}?action=updateProfileWithImage`, formData);
  }

// Obtener el número de mensajes no leídos para un usuario
getUnreadMessages(userId: number): Observable<any> {
  return this.http.get(`${this.API_URL}?action=getUnreadMessages&user_id=${userId}`);
}

}

