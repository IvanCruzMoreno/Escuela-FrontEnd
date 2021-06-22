import { Component, OnInit } from '@angular/core';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CommonListarComponent } from '../common-listar.component';


@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent extends CommonListarComponent<Alumno, AlumnoService> implements OnInit {

  public baseEndPoint = BASE_ENDPOINT + '/alumnos';

  constructor(service: AlumnoService) {
    super(service);
    this.titulo = 'Lista de alumnos';
    this.nombreEntity= Alumno.name;
   }

}
