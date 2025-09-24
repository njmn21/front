import { TestBed } from '@angular/core/testing';

import { HitoService } from './hito-service';

describe('HitoService', () => {
  let service: HitoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
