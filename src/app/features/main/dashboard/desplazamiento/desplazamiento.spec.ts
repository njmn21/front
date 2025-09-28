import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Desplazamiento } from './desplazamiento';

describe('Desplazamiento', () => {
  let component: Desplazamiento;
  let fixture: ComponentFixture<Desplazamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Desplazamiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Desplazamiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
