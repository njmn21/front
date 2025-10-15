import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezometroCasagrande } from './piezometro-casagrande';

describe('PiezometroCasagrande', () => {
  let component: PiezometroCasagrande;
  let fixture: ComponentFixture<PiezometroCasagrande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiezometroCasagrande]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiezometroCasagrande);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
