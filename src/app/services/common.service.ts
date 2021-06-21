import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Generic } from '../models/generic';



export abstract class CommonService<E extends Generic> {

  protected baseEndPoint: string;
  protected cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(protected http: HttpClient) { }

  public listar(): Observable<E[]> {
    return this.http.get(this.baseEndPoint).pipe(
      map(respuesta => respuesta as E[])
    );
  }

  public listarPaginas(page: string, size: string): Observable<any> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);

    return this.http.get<any>(`${this.baseEndPoint}/pagina`, {params: params});
  }

  public ver(id: number): Observable<E> {
    return this.http.get<E>(`${this.baseEndPoint}/${id}`);
  }

  public crear(entity: E): Observable<E> {
    return this.http.post<E>(this.baseEndPoint, entity, {headers: this.cabeceras});
  }

  public editar(entity: E): Observable<E> {
    return this.http.put<E>(`${this.baseEndPoint}/${entity.id}`, entity, {headers: this.cabeceras});
  }

  public eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseEndPoint}/${id}`);
  }
}
