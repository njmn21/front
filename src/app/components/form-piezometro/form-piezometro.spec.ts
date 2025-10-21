import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPiezometro } from './form-piezometro';

describe('FormPiezometro', () => {
  let component: FormPiezometro;
  let fixture: ComponentFixture<FormPiezometro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPiezometro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPiezometro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
