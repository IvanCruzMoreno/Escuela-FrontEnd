import { Injectable } from '@angular/core';

import { CommonService } from './common.service';
import { Alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends CommonService<Alumno>{

  protected baseEndPoint = "http://localhost:8090/api/alumnos";
  
}
