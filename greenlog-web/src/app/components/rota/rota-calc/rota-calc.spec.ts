import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotaCalc } from './rota-calc';

describe('RotaCalc', () => {
  let component: RotaCalc;
  let fixture: ComponentFixture<RotaCalc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RotaCalc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotaCalc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
