import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Piezometro } from './piezometro';

describe('Piezometro', () => {
  let component: Piezometro;
  let fixture: ComponentFixture<Piezometro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Piezometro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Piezometro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
