import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CommonFormComponent } from '../common-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent extends CommonFormComponent<Alumno, AlumnoService> implements OnInit {

  private fotoSeleccionada: File;

  constructor(service: AlumnoService,
    router: Router,
    route: ActivatedRoute) {

    super(service, router, route);
    this.titulo = 'Crear alumnos';
    this.entity = new Alumno();
    this.redirect = '/alumnos';
    this.nombreEntity = Alumno.name;
  }

  public seleccionarFoto(event): void {
    this.fotoSeleccionada = event.target.files[0];
    console.info(this.fotoSeleccionada);
    
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      this.fotoSeleccionada = null;
      Swal.fire('Error al seleccionar la foto', 'El archivo debe ser del tipo imagen', 'error');
    }
  }

  public crear(): void {
    if (!this.fotoSeleccionada) {
      super.crear();
    } else {
      this.service.crearConFoto(this.entity, this.fotoSeleccionada).subscribe(respuesta => {
        console.log(respuesta);
        Swal.fire('Nuevo', `${this.nombreEntity} ${respuesta.nombre} creado con exito`, 'success');
        this.router.navigate([this.redirect]);
      },
        errorRespuesta => {
          if (errorRespuesta.status === 400) {
            this.error = errorRespuesta.error;
            console.log(this.error);
          }
        });
    }
  }

  public editar(): void {
    if (!this.fotoSeleccionada) {
      super.editar();
    } else {
      this.service.editarConFoto(this.entity, this.fotoSeleccionada).subscribe(respuesta => {
        console.log(respuesta);
        Swal.fire('Modificado', `${this.nombreEntity} ${respuesta.nombre} editado con exito`, 'success');
        this.router.navigate([this.redirect]);
      },
        errorRespuesta => {
          if (errorRespuesta.status === 400) {
            this.error = errorRespuesta.error;
            console.log(this.error);
          }
        });
    }
  }
}
