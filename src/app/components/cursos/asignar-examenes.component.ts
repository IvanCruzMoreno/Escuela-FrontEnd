import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map } from 'rxjs/operators';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { CursoService } from 'src/app/services/curso.service';
import { ExamenService } from 'src/app/services/examen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css']
})
export class AsignarExamenesComponent implements OnInit {

  curso: Curso;
  examenesCurso: Examen[] = [];

  autocompleteControl = new FormControl();
  examenesFiltrados: Examen[] = [];
  examenesAsignados: Examen[] = [];

  mostrarColumnas: string[] = ['nombre', 'asignatura', 'quitar'];
  mostrarColumnasExamenes: string[] = ['id', 'nombre', 'asignaturas', 'eliminar'];
  tabIndex = 0;
  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageSizeOptions = [3, 5, 10, 20, 50];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private examenService: ExamenService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe( cursoR => {
        this.curso = cursoR;
        this.examenesCurso = this.curso.examenes;
        this.iniciarPaginador();
      });
    });

    this.autocompleteControl.valueChanges.pipe(
      map( valor => typeof valor === 'string'? valor: valor.nombre),
      flatMap( valor => valor? this.examenService.filtrarPorNombre(valor): [])
    ).subscribe(examenes => this.examenesFiltrados = examenes);
  }

  iniciarPaginador(){
    this.dataSource = new MatTableDataSource<Examen>(this.examenesCurso);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registro por pagina';
  }

  mostrarNombre(examen? : Examen): string {
    return examen? examen.nombre : '';
  }

  seleccionarExamen(event: MatAutocompleteSelectedEvent): void {
    const examen = event.option.value as Examen;
    if(!this.existe(examen.id)){

      this.examenesAsignados = this.examenesAsignados.concat(examen);

      console.log(this.examenesAsignados);
      
      this.autocompleteControl.setValue('');
      event.option.deselect();
      event.option.focus();
    }else{
      Swal.fire('Error', `El examen ${examen.nombre} ya esta asignado al curso`, 'error');
    }
  }

  private existe(id: number): boolean {
    let existe = false;
    this.examenesAsignados.concat(this.examenesCurso).forEach( examenesR => {
      if(id == examenesR.id){
        existe = true;
      }
    });
    return existe;
  }

  quitarDeExamenesAsignados(examen: Examen): void {
    this.examenesAsignados = this.examenesAsignados.filter(examenR => {
      examen.id !== examenR.id
    });
  }

  asignar(): void {
    console.log(this.examenesAsignados);
    this.cursoService.asignarExamenes(this.curso, this.examenesAsignados).subscribe( cursoR => {
      this.examenesCurso = this.examenesCurso.concat(this.examenesAsignados);
      this.iniciarPaginador();
      this.examenesAsignados = [];
      Swal.fire('Asignados', `Examenes asignados con exito al curso`, 'success');
      this.tabIndex = 2;
    });
  }

  eliminarExamenDelCurso(examen: Examen): void {
    Swal.fire({
      title: `¿Seguro que quieres eliminar a ${examen.nombre} de ${this.curso.nombre}?`,
      text: "No se podra recuperar la información!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursoService.eliminarExamen(this.curso, examen).subscribe(cursoRespuesta => {
          this.examenesCurso = this.examenesCurso.filter( examenR => examenR.id !== examen.id);
          this.iniciarPaginador();
          Swal.fire('Eliminado', `Examen ${examen.nombre} eliminado del curso ${this.curso.nombre}`, 'success');
        });
      }
    })
  }
}
