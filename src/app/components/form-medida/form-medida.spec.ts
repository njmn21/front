import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMedida } from './form-medida';

describe('FormMedida', () => {
  let component: FormMedida;
  let fixture: ComponentFixture<FormMedida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMedida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMedida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
