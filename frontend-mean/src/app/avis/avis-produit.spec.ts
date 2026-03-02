import { TestBed } from '@angular/core/testing';

import { AvisProduit } from './avis-produit';

describe('AvisProduit', () => {
  let service: AvisProduit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvisProduit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
