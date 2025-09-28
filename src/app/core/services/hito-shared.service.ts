import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IHitoGet } from '../interfaces/deposito';

@Injectable({
    providedIn: 'root'
})
export class HitoSharedService {

    private hitosSubject = new BehaviorSubject<IHitoGet[]>([]);
    hitos$ = this.hitosSubject.asObservable();

    setHitos(hitos: IHitoGet[]): void {
        this.hitosSubject.next(hitos);
    }

    getHitos(): IHitoGet[] {
        return this.hitosSubject.getValue();
    }
}