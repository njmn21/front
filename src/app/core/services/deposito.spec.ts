import { TestBed } from '@angular/core/testing';

import { Deposito } from './deposito';

describe('Deposito', () => {
  let service: Deposito;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deposito);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
