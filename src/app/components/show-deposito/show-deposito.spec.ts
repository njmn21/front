import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDeposito } from './show-deposito';

describe('ShowDeposito', () => {
  let component: ShowDeposito;
  let fixture: ComponentFixture<ShowDeposito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDeposito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDeposito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
