import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezometroGrafico } from './piezometro-grafico';

describe('PiezometroGrafico', () => {
  let component: PiezometroGrafico;
  let fixture: ComponentFixture<PiezometroGrafico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiezometroGrafico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiezometroGrafico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
