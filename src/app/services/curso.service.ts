import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService extends CommonService<Curso>{

  protected baseEndPoint = "http://localhost:8090/api/cursos";
  
}
