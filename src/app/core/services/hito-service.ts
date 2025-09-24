import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IHitoGet, IHitoPost } from '../interfaces/deposito';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HitoService {
  private baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllHitos(): Observable<IHitoGet[]> {
    const url = `${this.baseUrl}/Tailing/get-all-landmarks`;
    return this.http.get<{ result: IHitoGet[] }>(url)
      .pipe(
        map(response => response.result),
        catchError(error => {
          console.error('Error al obtener hitos:', error);
          return throwError(() => error);
        })
      );
  }

  addHito(hito: IHitoPost): Observable<IHitoPost> {
    const url = `${this.baseUrl}/Tailing/add-landmark`;
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
