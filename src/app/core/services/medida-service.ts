import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, throwError } from 'rxjs';
import { IMedidaGet, IMedidaPost, IMaxMedidaGet } from '../interfaces/hito';

@Injectable({
  providedIn: 'root'
})
export class MedidaService {
  private baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getMedidasById(id: number): Observable<IMedidaGet[]> {
    const url = `${this.baseUrl}/Topographic/get-measurements-by-landmark-id/${id}`;

    return this.http.get<{ result: IMedidaGet[] }>(url)
      .pipe(
        map(response => {
          return response.result;
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getMaxMedidaById(id: number): Observable<IMaxMedidaGet> {
    const url = `${this.baseUrl}/Topographic/get-max-measurement-by-landmark-id/${id}`;

    return this.http.get<{ result: IMaxMedidaGet }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error al obtener la medida máxima:', error);
          return throwError(() => error);
        })
      );
  }

  getMedidasByIds(hitoIds: number[]): Observable<IMedidaGet[]> {
    const url = `${this.baseUrl}/Topographic/get-measurements-by-landmark-ids`;
    const requestBody = { hitoIds };

    return this.http.post<{ result: IMedidaGet[] }>(url, requestBody)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error en getMedidasByIds:', error);
          return throwError(() => error);
        })
      );
  }

  addMeasurement(medida: IMedidaPost): Observable<IMedidaPost> {
    const url = `${this.baseUrl}/Topographic/add-measurement`;
    return this.http.post<{ result: IMedidaPost }>(url, medida)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          console.error('Error al agregar medida:', error);
          return throwError(() => error);
        })
      );
  }

  editMeasurement(medicionId: number, medidaEdit: any): Observable<any> {
    const url = `${this.baseUrl}/Topographic/edit-measurement/${medicionId}`;
    return this.http.put<any>(url, medidaEdit)
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Error al editar medida:', error);
          return throwError(() => error);
        })
      );
  }
}
