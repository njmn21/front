import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionesMapa } from './ubicaciones-mapa';

describe('UbicacionesMapa', () => {
  let component: UbicacionesMapa;
  let fixture: ComponentFixture<UbicacionesMapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicacionesMapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicacionesMapa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
