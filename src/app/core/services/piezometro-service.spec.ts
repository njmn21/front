import { TestBed } from '@angular/core/testing';

import { PiezometroService } from './piezometro-service';

describe('PiezometroService', () => {
  let service: PiezometroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiezometroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
