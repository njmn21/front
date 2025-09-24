import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDepositoGet, IDepositoPost } from '../interfaces/deposito';

@Injectable({
  providedIn: 'root'
})
export class Deposito {
  private baseUrl = `${environment.API_URL}`

  constructor(private http: HttpClient) { }

  getAllDepositos(): Observable<IDepositoGet[]> {
    const url = `${this.baseUrl}/Tailing/get-all-deposits`;
    return this.http.get<{ result: IDepositoGet[] }>(url)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          console.error('Error al obtener depósitos:', error);
          return throwError(() => error);
        })
      );
  }

  addDeposito(deposito: IDepositoPost): Observable<IDepositoGet> {
    const url = `${this.baseUrl}/Tailing/create-deposit`;
    return this.http.post<{ result: number }>(url, deposito)
      .pipe(
        map((response: any) => response.result),
        catchError(error => {
          console.error('Error al agregar depósito:', error);
          return throwError(() => error);
        })
      );
  }

}