import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDeposito } from '../core/interfaces/deposito';

@Injectable({
  providedIn: 'root'
})
export class Deposito {
  private baseUrl = `${environment.API_URL}/Tailing/get-all-deposits`;

  constructor(private http: HttpClient) { }

  getAllDepositos(): Observable<IDeposito[]> {
    return this.http.get<{ result: IDeposito[] }>(this.baseUrl)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          // Puedes mostrar un mensaje, loguear, etc.
          console.error('Error al obtener depósitos:', error);
          return throwError(() => error);
        })
      );
  }
}
