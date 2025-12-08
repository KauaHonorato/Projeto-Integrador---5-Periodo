import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaminhaoList } from './caminhao-list';

describe('CaminhaoList', () => {
  let component: CaminhaoList;
  let fixture: ComponentFixture<CaminhaoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaminhaoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaminhaoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
