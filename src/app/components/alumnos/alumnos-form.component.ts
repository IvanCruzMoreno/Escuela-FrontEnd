import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent implements OnInit {

  titulo: string = 'Crear alumnos';
  alumno: Alumno = new Alumno();
  error: any;

  constructor(private service: AlumnoService, private route: Router) { }

  ngOnInit(): void {
  }

  public crear(): void {
    this.service.crear(this.alumno).subscribe( alumnoRespuesta => {
      console.log(alumnoRespuesta);
      alert(`Alumno ${alumnoRespuesta.nombre} creado con exito`);
      this.route.navigate(['/alumnos']);
    },
    errorRespuesta => {
      if(errorRespuesta.status === 400){
        this.error = errorRespuesta.error;
        console.log(this.error);
      }
    });
  }
}
