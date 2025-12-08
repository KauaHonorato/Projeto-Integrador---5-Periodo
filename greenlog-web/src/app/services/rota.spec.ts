import { TestBed } from '@angular/core/testing';

import { Rota } from './rota';

describe('Rota', () => {
  let service: Rota;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rota);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
