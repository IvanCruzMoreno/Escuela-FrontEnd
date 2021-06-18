import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  titulo: string = 'Lista de alumnos';
  alumnos: Alumno[] = [];

  totalRegistros = 0;
  totalPorPagina = 4;
  paginaActual = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private service: AlumnoService) { }

  ngOnInit(): void {
    this.calculatePage();
  }

  public paginar(event: PageEvent): void{
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    
    this.calculatePage();
  }

  public calculatePage(){
    const currentPage = this.paginaActual.toString();
    const sizeForPage = this.totalPorPagina.toString();

    this.service.listarPaginas(currentPage, sizeForPage).subscribe(json => {
      this.alumnos = json.content as Alumno[];
      this.totalRegistros = json.totalElements as number;    
    });
  }

  public eliminar(alumno: Alumno): void {

    Swal.fire({
      title: `¿Seguro que quieres eliminar a ${alumno.nombre}?`,
      text: "No se podra recuperar la información!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(alumno.id).subscribe( () => {
          //this.alumnos = this.alumnos.filter( alumnoLista => alumnoLista !== alumno);
          this.calculatePage();
          Swal.fire('Eliminado',`Alumno ${alumno.nombre} eliminado con exito`, 'success')
        });
      }
    })

  }

}
