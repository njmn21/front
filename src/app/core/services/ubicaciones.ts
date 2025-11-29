import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IGetLandmarkConverted, IGetPiezometerConverted } from '../interfaces/coordinates-convert';

@Injectable({
  providedIn: 'root'
})
export class Ubicaciones {
  private baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getCoordinatesLandmarks(): Observable<IGetLandmarkConverted[]> {
    const url = `${this.baseUrl}/topographic/get-converted-landmarks`;
    return this.http.get<{ result: IGetLandmarkConverted[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error al obtener hitos convertidos:', error);
          return throwError(() => error);
        })
      );
  }

  getCoordinatesPiezometers(): Observable<IGetPiezometerConverted[]> {
    const url = `${this.baseUrl}/Piezometer/get-converted-piezometers`;
    return this.http.get<{ result: IGetPiezometerConverted[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error al obtener piezómetros convertidos:', error);
          return throwError(() => error);
        })
      );
  }
}
