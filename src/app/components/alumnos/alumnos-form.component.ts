import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private service: AlumnoService, 
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(alumnoRespuesta => {
          this.alumno = alumnoRespuesta;
        });
      }
    });

  }

  public crear(): void {
    this.service.crear(this.alumno).subscribe( alumnoRespuesta => {
      console.log(alumnoRespuesta);
      alert(`Alumno ${alumnoRespuesta.nombre} creado con exito`);
      this.router.navigate(['/alumnos']);
    },
    errorRespuesta => {
      if(errorRespuesta.status === 400){
        this.error = errorRespuesta.error;
        console.log(this.error);
      }
    });
  }

  public editar(): void {
    this.service.editar(this.alumno).subscribe( alumnoRespuesta => {
      console.log(alumnoRespuesta);
      alert(`Alumno ${alumnoRespuesta.nombre} editado con exito`);
      this.router.navigate(['/alumnos']);
    },
    errorRespuesta => {
      if(errorRespuesta.status === 400){
        this.error = errorRespuesta.error;
        console.log(this.error);
      }
    });
  }


}
