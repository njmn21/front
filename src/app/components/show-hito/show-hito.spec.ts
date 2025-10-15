import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHito } from './show-hito';

describe('ShowHito', () => {
  let component: ShowHito;
  let fixture: ComponentFixture<ShowHito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowHito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowHito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
