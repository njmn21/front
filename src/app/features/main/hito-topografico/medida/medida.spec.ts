import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medida } from './medida';

describe('Medida', () => {
  let component: Medida;
  let fixture: ComponentFixture<Medida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Medida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
