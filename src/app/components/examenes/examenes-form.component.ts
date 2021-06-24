import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from 'src/app/models/asignatura';
import { Examen } from 'src/app/models/examen';
import { Pregunta } from 'src/app/models/pregunta';
import { ExamenService } from 'src/app/services/examen.service';
import Swal from 'sweetalert2';
import { CommonFormComponent } from '../common-form.component';

@Component({
  selector: 'app-examenes-form',
  templateUrl: './examenes-form.component.html',
  styleUrls: ['./examenes-form.component.css']
})
export class ExamenesFormComponent extends CommonFormComponent<Examen, ExamenService> implements OnInit {

  asignaturasPadre: Asignatura[] = [];
  asignaturasHija: Asignatura[] = [];

  constructor(service: ExamenService, 
    router: Router,
    route: ActivatedRoute) { 
      super(service, router, route);
      this.titulo = 'Crear Examen';
      this.entity = new Examen();
      this.nombreEntity = Examen.name;
      this.redirect = '/examenes';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(respuesta => {
          this.entity = respuesta;
          this.cargarHijos();
        });
        this.titulo = `Editar ${this.nombreEntity}`;
      }
    });

    this.service.findAllAsignatura().subscribe( asignaturasRespuesta => {
      this.asignaturasPadre = asignaturasRespuesta.filter( asignaturaRespuesta => 
        !asignaturaRespuesta.padre);
    });
  }

  public crear(): void {
    if(this.entity.preguntas.length === 0){
      Swal.fire('Error Preguntas', 'Examen debe tener preguntas', 'error');
      return;
    }
    this.eliminarPreguntasVacias();
    super.crear();
  }

  public editar(): void {
    if(this.entity.preguntas.length === 0){
      Swal.fire('Error Preguntas', 'Examen debe tener preguntas', 'error');
      return;
    }
    this.eliminarPreguntasVacias();
    super.editar();
  }

  cargarHijos(): void {
    this.asignaturasHija = this.entity.asignaturaPadre? this.entity.asignaturaPadre.hijos : [];
  }

  compararAsignatura(a1: Asignatura, a2: Asignatura): boolean{
    if(a1 === undefined && a2 === undefined){
      return true;
    }
    return (a1 === null || a1 === undefined || a2 === null || a2 === undefined)? false: a1.id === a2.id;
  }

  agregarPregunta(): void {
    this.entity.preguntas.push(new Pregunta());
  }

  asignarTexto(pregunta: Pregunta, event): void {
    pregunta.texto = event.target.value as string;
    console.log(this.entity);
  }

  eliminarPregunta(pregunta): void {
    this.entity.preguntas = this.entity.preguntas.filter( preguntaRespuesta =>
      preguntaRespuesta.texto !== pregunta.texto
    );
  }

  eliminarPreguntasVacias(): void {
    this.entity.preguntas = this.entity.preguntas.filter( preguntaRespuesta => 
      preguntaRespuesta.texto != null && preguntaRespuesta.texto.length > 0);
  }
}
