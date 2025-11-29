import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMedidaPiezometro } from './show-medida-piezometro';

describe('ShowMedidaPiezometro', () => {
  let component: ShowMedidaPiezometro;
  let fixture: ComponentFixture<ShowMedidaPiezometro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMedidaPiezometro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMedidaPiezometro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
