import { Component, OnInit } from '@angular/core';
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

  constructor(private service: AlumnoService) { }

  ngOnInit(): void {

    this.service.listar().subscribe(alumnos => {
      this.alumnos = alumnos;    
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
          this.alumnos = this.alumnos.filter( alumnoLista => alumnoLista !== alumno);
          Swal.fire('Eliminado',`Alumno ${alumno.nombre} eliminado con exito`, 'success')
        });
      }
    })

  }

}
