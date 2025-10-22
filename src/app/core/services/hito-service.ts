import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IHitoGet, IHitoGetWithCoordinates, IHitoPost } from '../interfaces/hito';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HitoService {
  private baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllHitos(): Observable<IHitoGet[]> {
    const url = `${this.baseUrl}/Topographic/get-all-landmarks`;
    return this.http.get<{ result: IHitoGet[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error al obtener hitos:', error);
          return throwError(() => error);
        })
      );
  }

  getAllHitosWithCoordinates(): Observable<IHitoGetWithCoordinates[]> {
    const url = `${this.baseUrl}/Topographic/get-all-landmarks-with-coordinates`;
    return this.http.get<{ result: IHitoGetWithCoordinates[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error al obtener hitos con coordenadas:', error);
          return throwError(() => error);
        })
      );
  }

  addHito(hito: IHitoPost): Observable<IHitoPost> {
    const url = `${this.baseUrl}/Topographic/add-landmark`;
    return this.http.post<{ result: IHitoPost }>(url, hito)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          console.error('Error al agregar hito:', error);
          return throwError(() => error);
        })
      )
  }
}
