import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IKeyMap } from '../interfaces/keyMap';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly baseURl = `${environment.API_URL}`;

  constructor(
    private readonly http: HttpClient
  ) { }

  getKeyMap(): Observable<IKeyMap> {
    const url = `${this.baseURl}/map/get-key`;
    return this.http.get<IKeyMap>(url);
  }
}
