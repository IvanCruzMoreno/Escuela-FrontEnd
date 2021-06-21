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

  constructor(service: AlumnoService, 
              router: Router,
              route: ActivatedRoute) { 
                
                super(service, router, route);
                this.titulo = 'Crear alumnos';
                this.entity = new Alumno();
                this.redirect = '/alumnos';
                this.nombreEntity = Alumno.name;
              }

}
