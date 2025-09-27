import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMedida } from './show-medida';

describe('ShowMedida', () => {
  let component: ShowMedida;
  let fixture: ComponentFixture<ShowMedida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMedida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMedida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
