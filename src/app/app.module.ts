import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { ExamenesComponent } from './components/examenes/examenes.component';

import {AlumnoService} from './services/alumno.service';
import {CursoService} from './services/curso.service';
import {ExamenService} from './services/examen.service';
import {RespuestaService} from './services/respuesta.service';

@NgModule({
  declarations: [
    AppComponent,
    AlumnosComponent,
    CursosComponent,
    ExamenesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule
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
