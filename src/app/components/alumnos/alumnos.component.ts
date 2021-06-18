import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';

import Swal from 'sweetalert2'

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
    if(confirm(`¿Seguro que quieres eliminar a ${alumno.nombre}?`)){
      this.service.eliminar(alumno.id).subscribe( () => {
        this.alumnos = this.alumnos.filter( alumnoLista => alumnoLista !== alumno);
        alert(`Alumno ${alumno.nombre} eliminado con exito`)
      });
    }
  }

}
