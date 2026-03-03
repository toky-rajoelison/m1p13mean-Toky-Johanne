import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitBoutique } from './produit-boutique';

describe('ProduitBoutique', () => {
  let component: ProduitBoutique;
  let fixture: ComponentFixture<ProduitBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
