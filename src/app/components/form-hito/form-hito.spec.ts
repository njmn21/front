import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHito } from './form-hito';

describe('FormHito', () => {
  let component: FormHito;
  let fixture: ComponentFixture<FormHito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormHito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
