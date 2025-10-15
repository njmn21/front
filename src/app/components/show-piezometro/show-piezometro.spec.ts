import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPiezometro } from './show-piezometro';

describe('ShowPiezometro', () => {
  let component: ShowPiezometro;
  let fixture: ComponentFixture<ShowPiezometro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPiezometro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPiezometro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
