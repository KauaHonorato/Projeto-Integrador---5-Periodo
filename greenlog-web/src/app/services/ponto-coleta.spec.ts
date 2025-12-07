import { TestBed } from '@angular/core/testing';

import { PontoColeta } from './ponto-coleta';

describe('PontoColeta', () => {
  let service: PontoColeta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PontoColeta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
