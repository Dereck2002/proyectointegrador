import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'list-pacientes',
    loadChildren: () => import('./list-pacientes/list-pacientes.module').then( m => m.ListPacientesPageModule)
  },
  {
    path: 'add-signos',
    loadChildren: () => import('./add-signos/add-signos.module').then( m => m.AddSignosPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'add-medicamento',
    loadChildren: () => import('./add-medicamento/add-medicamento.module').then( m => m.AddMedicamentoPageModule)
  },
  {
    path: 'mensajes',
    loadChildren: () => import('./mensajes/mensajes.module').then( m => m.MensajesPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'medicamentos',
    loadChildren: () => import('./medicamentos/medicamentos.module').then( m => m.MedicamentosPageModule)
  },
  {
    path: 'signos',
    loadChildren: () => import('./signos/signos.module').then( m => m.SignosPageModule)
  },
  {
    path: 'pacientes',
    loadChildren: () => import('./pacientes/pacientes.module').then( m => m.PacientesPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'medicamentosp',
    loadChildren: () => import('./medicamentosp/medicamentosp.module').then( m => m.MedicamentospPageModule)
  },

  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'medicos',
    loadChildren: () => import('./medicos/medicos.module').then( m => m.MedicosPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'list-medicos',
    loadChildren: () => import('./list-medicos/list-medicos.module').then( m => m.ListMedicosPageModule)
  },
  {
    path: 'ac-pacientes',
    loadChildren: () => import('./ac-pacientes/ac-pacientes.module').then( m => m.AcPacientesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
