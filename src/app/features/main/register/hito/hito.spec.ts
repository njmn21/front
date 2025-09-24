import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hito } from './hito';

describe('Hito', () => {
  let component: Hito;
  let fixture: ComponentFixture<Hito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
