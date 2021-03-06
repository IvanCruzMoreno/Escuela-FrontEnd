import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { Respuesta } from 'src/app/models/respuesta';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CursoService } from 'src/app/services/curso.service';
import { RespuestaService } from 'src/app/services/respuesta.service';
import Swal from 'sweetalert2';
import { ResponderExamenModalComponent } from './responder-examen-modal.component';
import { VerExamenModalComponent } from './ver-examen-modal.component';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {

  alumno: Alumno;
  curso: Curso;
  examenes: Examen[] = [];

  mostrarColumnasExamenes = ['id', 'nombre', 'asignaturas', 'preguntas', 'responder', 'ver'];
  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageSizeOptions = [3, 5, 10, 20, 30];

  constructor(private route: ActivatedRoute,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private respuestaService: RespuestaService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      
      this.alumnoService.ver(id).subscribe( alumnoR => {
        this.alumno = alumnoR;

        this.cursoService.obtenerCursoPorAlumnoId(this.alumno).subscribe(cursoR => {
          this.curso = cursoR;
          this.examenes = (this.curso && this.curso.examenes)? this.curso.examenes: [];
          this.dataSource = new MatTableDataSource<Examen>(this.examenes);
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = 'Registros por pagina:';
        });

      });
    });
  }

  responderExamen(examen: Examen): void {
    const modalRef = this.dialog.open(ResponderExamenModalComponent, {
      width: '750px',
      data: {curso: this.curso, alumno: this.alumno, exam: examen}
    });

    modalRef.afterClosed().subscribe( (respuestasMap: Map<number, Respuesta>) => {
      console.log('Cerrado');
      console.log(respuestasMap);
      if(respuestasMap){
        const respuestas: Respuesta[] = Array.from(respuestasMap.values());
        console.log('---------------');
        console.log(respuestas);
        this.respuestaService.crear(respuestas).subscribe( respuestasR => {
          examen.respondido = true;
          Swal.fire('Respuestas enviadas', 'Con exito', 'success');
        });
      }
    });

  }

  verExamen(examen: Examen): void {
    this.respuestaService.obtenerRespuestaByAlumnoAndExamen(this.alumno, examen).subscribe( respuestasR => {
      
      const modalRef = this.dialog.open(VerExamenModalComponent, {
        width: '750px',
        data: {curso: this.curso, exam: examen, respuestas: respuestasR}
      });

      modalRef.afterClosed().subscribe( () => {
        console.log('-- cerrado --');
      });

    });
  }

}
