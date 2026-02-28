import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisProduit } from './avis-produit';

describe('AvisProduit', () => {
  let component: AvisProduit;
  let fixture: ComponentFixture<AvisProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisProduit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
