import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, throwError } from 'rxjs';
import { IMedidadGet, IMedidaPost } from '../interfaces/deposito';

@Injectable({
  providedIn: 'root'
})
export class MedidaService {
  private baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllMedidas(): Observable<IMedidadGet[]> {
    const url = `${this.baseUrl}/Tailing/get-all-measurements`;
    return this.http.get<{ result: IMedidadGet[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error al obtener medidas:', error);
          return throwError(() => error);
        })
      );
  }

  addMeasurement(medida: IMedidaPost): Observable<IMedidaPost> {
    const url = `${this.baseUrl}/Tailing/add-measurement`;
    return this.http.post<{ result: IMedidaPost }>(url, medida)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          console.error('Error al agregar medida:', error);
          return throwError(() => error);
        })
      );
  }
}
