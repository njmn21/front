import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoRelave } from './deposito-relave';

describe('DepositoRelave', () => {
  let component: DepositoRelave;
  let fixture: ComponentFixture<DepositoRelave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositoRelave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositoRelave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
