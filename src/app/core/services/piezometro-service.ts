import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { IPiezometroGet } from '../interfaces/piezometro';

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
}
