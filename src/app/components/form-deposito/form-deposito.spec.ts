import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDeposito } from './form-deposito';

describe('FormDeposito', () => {
  let component: FormDeposito;
  let fixture: ComponentFixture<FormDeposito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDeposito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDeposito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
