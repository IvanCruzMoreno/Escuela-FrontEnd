import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

import Swal from 'sweetalert2';

@Directive()
export abstract class CommonFormComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string;
  entity: E;
  error: any;
  protected redirect: string;
  protected nombreEntity: string;

  constructor(protected service: S, 
              protected router: Router,
              protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(respuesta => {
          this.entity = respuesta;
        });
      }
    });

  }

  public crear(): void {
    this.service.crear(this.entity).subscribe( respuesta => {
      console.log(respuesta);
      Swal.fire('Nuevo',`${this.nombreEntity} ${respuesta.nombre} creado con exito`, 'success');
      this.router.navigate([this.redirect]);
    },
    errorRespuesta => {
      if(errorRespuesta.status === 400){
        this.error = errorRespuesta.error;
        console.log(this.error);
      }
    });
  }

  public editar(): void {
    this.service.editar(this.entity).subscribe( respuesta => {
      console.log(respuesta);
      Swal.fire('Modificado',`${this.nombreEntity} ${respuesta.nombre} editado con exito`, 'success');
      this.router.navigate([this.redirect]);
    },
    errorRespuesta => {
      if(errorRespuesta.status === 400){
        this.error = errorRespuesta.error;
        console.log(this.error);
      }
    });
  }


}
