import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Velocidad } from './velocidad';

describe('Velocidad', () => {
  let component: Velocidad;
  let fixture: ComponentFixture<Velocidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Velocidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Velocidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
