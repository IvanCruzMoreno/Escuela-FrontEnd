import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { ExamenesComponent } from './components/examenes/examenes.component';

import {AlumnoService} from './services/alumno.service';
import {CursoService} from './services/curso.service';
import {ExamenService} from './services/examen.service';
import {RespuestaService} from './services/respuesta.service';
import { AlumnosFormComponent } from './components/alumnos/alumnos-form.component';


@NgModule({
  declarations: [
    AppComponent,
    AlumnosComponent,
    CursosComponent,
    ExamenesComponent,
    AlumnosFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AlumnoService,
    CursoService,
    ExamenService,
    RespuestaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
