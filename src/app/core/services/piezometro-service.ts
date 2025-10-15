import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { IMeasurementPiezometroGet, IMesasurementPiezometroPost, IPiezometroGet } from '../interfaces/piezometro';

@Injectable({
  providedIn: 'root'
})
export class PiezometroService {
  private baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllPiezometros(): Observable<IPiezometroGet[]> {
    const url = `${this.baseUrl}/Piezometer/get-all-piezometers`;
    return this.http.get<{ result: IPiezometroGet[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          return throwError(() => error);
        })
      )
  }

  getMeasurementsByPiezomettroId(piezometroId: number): Observable<IMeasurementPiezometroGet[]> {
    const url = `${this.baseUrl}/Piezometer/get-all-measurementes-piezometer-id/${piezometroId}`;
    return this.http.get<{ result: IMeasurementPiezometroGet[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          return throwError(() => error);
        })
      )
  }

  addMeasurement(measurement: IMesasurementPiezometroPost): Observable<void> {
    const url = `${this.baseUrl}/Piezometer/add-piezometer-measurement`;
    return this.http.post<{ result: IMesasurementPiezometroPost }>(url, measurement)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          console.error('Error al agregar medida:', error);
          return throwError(() => error);
        })
      );
  }
}
