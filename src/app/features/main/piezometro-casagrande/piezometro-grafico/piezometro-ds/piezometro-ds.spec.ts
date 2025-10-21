import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezometroDs } from './piezometro-ds';

describe('PiezometroDs', () => {
  let component: PiezometroDs;
  let fixture: ComponentFixture<PiezometroDs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiezometroDs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiezometroDs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
