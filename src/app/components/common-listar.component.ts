import { OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

import Swal from 'sweetalert2';


export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string;
  lista: E[] = [];
  protected nombreEntity: string;

  totalRegistros = 0;
  totalPorPagina = 4;
  paginaActual = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(protected service: S) { }

  ngOnInit(): void {
    this.calculatePage();
  }

  public paginar(event: PageEvent): void{
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    
    this.calculatePage();
  }

  public calculatePage(){
    const currentPage = this.paginaActual.toString();
    const sizeForPage = this.totalPorPagina.toString();

    this.service.listarPaginas(currentPage, sizeForPage).subscribe(json => {
      this.lista = json.content as E[];
      this.totalRegistros = json.totalElements as number;    
    });
  }

  public eliminar(entity: E): void {

    Swal.fire({
      title: `¿Seguro que quieres eliminar a ${entity.nombre}?`,
      text: "No se podra recuperar la información!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(entity.id).subscribe( () => {
          this.calculatePage();
          Swal.fire('Eliminado',`${this.nombreEntity} ${entity.nombre} eliminado con exito`, 'success')
        });
      }
    })

  }

}
