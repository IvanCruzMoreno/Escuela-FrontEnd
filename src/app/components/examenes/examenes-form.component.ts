import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from 'src/app/models/examen';
import { ExamenService } from 'src/app/services/examen.service';
import { CommonFormComponent } from '../common-form.component';

@Component({
  selector: 'app-examenes-form',
  templateUrl: './examenes-form.component.html',
  styleUrls: ['./examenes-form.component.css']
})
export class ExamenesFormComponent extends CommonFormComponent<Examen, ExamenService> implements OnInit {

  constructor(service: ExamenService, 
    router: Router,
    route: ActivatedRoute) { 
      super(service, router, route);
      this.titulo = 'Crear Examen';
      this.entity = new Examen();
      this.nombreEntity = Examen.name;
      this.redirect = '/examenes';
    }

}
