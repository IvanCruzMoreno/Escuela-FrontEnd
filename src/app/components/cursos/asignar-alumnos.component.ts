import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CursoService } from 'src/app/services/curso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {

  curso: Curso;
  alumnosMostrar: Alumno[] = [];
  mostrarColumnas: string[] = ['nombre', 'apellido', 'seleccion'];
  alumnosSeleccionados: SelectionModel<Alumno> = new SelectionModel<Alumno>(true, []);

  constructor(private route: ActivatedRoute,
              private cursoService: CursoService,
              private alumnoService: AlumnoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id : number = +params.get('id');
      this.cursoService.ver(id).subscribe( cursoRespuesta => this.curso = cursoRespuesta);
    });
  }

  filtrar(nombre: string): void {

    nombre = nombre !== undefined? nombre.trim(): '';
    
    if(nombre !== ''){
      this.alumnoService.filtrarPorNombre(nombre).subscribe( alumnosRespuesta => {
        this.alumnosMostrar = alumnosRespuesta.filter(alumnoR => {
          let isInCurso = true;
          this.curso.alumnos.forEach(cursoAlumno => {
            if(alumnoR.id === cursoAlumno.id){
              isInCurso = false;
            }
          });
          return isInCurso;
        });

      });
    }
  }

  estanTodosSeleccionados(): boolean {
    const numSeleccionados = this.alumnosSeleccionados.selected.length;
    const numAlumnos = this.alumnosMostrar.length;
    return (numSeleccionados === numAlumnos);
  }
  
  seleccionarDesSeleccionarTodos(): void {
    this.estanTodosSeleccionados()? 
    this.alumnosSeleccionados.clear(): 
    this.alumnosMostrar.forEach( alumno => this.alumnosSeleccionados.select(alumno))
  }

  asignar(): void {
    console.log(this.alumnosSeleccionados.selected);
    this.cursoService.asignarAlumno(this.curso, this.alumnosSeleccionados.selected)
    .subscribe( cursoRespuesta => {
      Swal.fire('Alumnos asignados', 'Con exito!', 'success');
      this.alumnosMostrar = [];
      this.alumnosSeleccionados.clear();
    }, 
    e => {
      if(e.status === 500){
        const mensaje = e.error.message as string;
        if(mensaje.indexOf('ConstrainViolationException') != 1){
          Swal.fire('Cuidado',
           'El alumno ya esta registrado en otro curso',
           'error');
        }
      }
    });
  }
}
