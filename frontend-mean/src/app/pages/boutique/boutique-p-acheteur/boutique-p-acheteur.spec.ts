import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiquePAcheteur } from './boutique-p-acheteur';

describe('BoutiquePAcheteur', () => {
  let component: BoutiquePAcheteur;
  let fixture: ComponentFixture<BoutiquePAcheteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiquePAcheteur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiquePAcheteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
