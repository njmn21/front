import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trayectoria } from './trayectoria';

describe('Trayectoria', () => {
  let component: Trayectoria;
  let fixture: ComponentFixture<Trayectoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trayectoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trayectoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
