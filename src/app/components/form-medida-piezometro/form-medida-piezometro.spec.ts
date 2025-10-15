import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMedidaPiezometro } from './form-medida-piezometro';

describe('FormMedidaPiezometro', () => {
  let component: FormMedidaPiezometro;
  let fixture: ComponentFixture<FormMedidaPiezometro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMedidaPiezometro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMedidaPiezometro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
