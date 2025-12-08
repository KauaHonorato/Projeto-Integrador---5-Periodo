import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaminhaoForm } from './caminhao-form';

describe('CaminhaoForm', () => {
  let component: CaminhaoForm;
  let fixture: ComponentFixture<CaminhaoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaminhaoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaminhaoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
