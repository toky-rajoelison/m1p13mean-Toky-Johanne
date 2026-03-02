import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueAcheteur } from './boutique-acheteur';

describe('BoutiqueAcheteur', () => {
  let component: BoutiqueAcheteur;
  let fixture: ComponentFixture<BoutiqueAcheteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueAcheteur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueAcheteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
