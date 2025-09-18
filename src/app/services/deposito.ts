import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDepositoGet, IDepositoPost } from '../core/interfaces/deposito';

@Injectable({
  providedIn: 'root'
})
export class Deposito {
  private baseUrl = `${environment.API_URL}/Tailing/get-all-deposits`;

  constructor(private http: HttpClient) { }

  getAllDepositos(): Observable<IDepositoGet[]> {
    return this.http.get<{ result: IDepositoGet[] }>(this.baseUrl)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          // Puedes mostrar un mensaje, loguear, etc.
          console.error('Error al obtener depósitos:', error);
          return throwError(() => error);
        })
      );
  }
  addDeposito(deposito: IDepositoPost): Observable<IDepositoGet> {
    const url = `${environment.API_URL}/Tailing/create-deposit`;
    return this.http.post<{ result: IDepositoGet }>(url, deposito)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          console.error('Error al agregar depósito:', error);
          return throwError(() => error);
        })
      );
  }

}