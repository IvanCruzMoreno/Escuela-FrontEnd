import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnosFormComponent } from './components/alumnos/alumnos-form.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { CursosFormComponent } from './components/cursos/cursos-form.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { ExamenesComponent } from './components/examenes/examenes.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'alumnos'},
  {path: 'alumnos/form', component: AlumnosFormComponent},
  {path: 'alumnos/form/:id', component: AlumnosFormComponent},
  {path: 'alumnos', component: AlumnosComponent},
  {path: 'cursos/form', component: CursosFormComponent},
  {path: 'cursos/form/:id', component: CursosFormComponent},
  {path: 'cursos', component: CursosComponent},
  {path: 'examenes', component: ExamenesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
