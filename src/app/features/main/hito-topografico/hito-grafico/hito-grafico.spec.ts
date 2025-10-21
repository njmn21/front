import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitoGrafico } from './hito-grafico';

describe('HitoGrafico', () => {
  let component: HitoGrafico;
  let fixture: ComponentFixture<HitoGrafico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HitoGrafico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitoGrafico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
