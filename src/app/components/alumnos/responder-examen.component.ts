import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CursoService } from 'src/app/services/curso.service';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {

  alumno: Alumno;
  curso: Curso;
  examenes: Examen[] = [];

  mostrarColumnasExamenes = ['id', 'nombre', 'asignaturas', 'preguntas'];

  constructor(private route: ActivatedRoute,
    private alumnoService: AlumnoService,
    private cursoService: CursoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      
      this.alumnoService.ver(id).subscribe( alumnoR => {
        this.alumno = alumnoR;

        this.cursoService.obtenerCursoPorAlumnoId(this.alumno).subscribe(cursoR => {
          this.curso = cursoR;
          this.examenes = (this.curso && this.curso.examenes)? this.curso.examenes: []; 
        });

      });
    });
  }

}