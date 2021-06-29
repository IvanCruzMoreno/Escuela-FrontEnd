import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

  cursoAlumnos: Alumno[] = [];
  mostrarColumnasAlumnos: string[] = ['id','nombre', 'apellido', 'email', 'eliminar'];
  tabIndex = 0;

  dataSource: MatTableDataSource<Alumno>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageSizeOptions = [3, 5, 10, 20, 50];

  constructor(private route: ActivatedRoute,
              private cursoService: CursoService,
              private alumnoService: AlumnoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id : number = +params.get('id');
      this.cursoService.ver(id).subscribe( cursoRespuesta => {
        this.curso = cursoRespuesta;
        this.cursoAlumnos = this.curso.alumnos;
        this.iniciarPaginador();
      });
    });
  }

  private iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Alumno>(this.cursoAlumnos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por pagina';
  }

  filtrar(nombre: string): void {

    nombre = nombre !== undefined? nombre.trim(): '';
    
    if(nombre !== ''){
      this.alumnoService.filtrarPorNombre(nombre).subscribe( alumnosRespuesta => {
        this.alumnosMostrar = alumnosRespuesta.filter(alumnoR => {
          let isInCurso = true;
          this.cursoAlumnos.forEach(cursoAlumno => {
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
      this.tabIndex = 2;
      Swal.fire('Alumnos asignados', 'Con exito!', 'success');
      this.cursoAlumnos = this.cursoAlumnos.concat(this.alumnosSeleccionados.selected);
      this.iniciarPaginador();
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

  eliminarAlumno(alumno: Alumno): void {

    Swal.fire({
      title: `¿Seguro que quieres eliminar a ${alumno.nombre} de ${this.curso.nombre}?`,
      text: "No se podra recuperar la información!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursoService.eliminarAlumno(this.curso, alumno).subscribe(cursoRespuesta => {
          this.cursoAlumnos = this.cursoAlumnos.filter( alumnoR => alumnoR.id !== alumno.id);
          this.iniciarPaginador();
          Swal.fire('Eliminado', `Alumno ${alumno.nombre} eliminado del curso ${this.curso.nombre}`, 'success');
        });
      }
    })

    
  }
}
