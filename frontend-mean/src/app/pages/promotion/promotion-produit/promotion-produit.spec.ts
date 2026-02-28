import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionProduit } from './promotion-produit';

describe('PromotionProduit', () => {
  let component: PromotionProduit;
  let fixture: ComponentFixture<PromotionProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionProduit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
