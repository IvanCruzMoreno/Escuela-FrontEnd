import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
  autocompleteControl = new FormControl();
  examenesFiltrados: Examen[] = [];
  examenesAsignados: Examen[] = [];

  mostrarColumnas: string[] = ['nombre', 'asignatura', 'quitar'];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private examenService: ExamenService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe( cursoR => this.curso = cursoR);
    });

    this.autocompleteControl.valueChanges.pipe(
      map( valor => typeof valor === 'string'? valor: valor.nombre),
      flatMap( valor => valor? this.examenService.filtrarPorNombre(valor): [])
    ).subscribe(examenes => this.examenesFiltrados = examenes);
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
    this.examenesAsignados.concat(this.curso.examenes).forEach( examenesR => {
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
}
