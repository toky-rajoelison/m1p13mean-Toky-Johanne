import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisBoutiqueComponent } from './avis-boutique';

describe('AvisBoutiqueComponent', () => {
  let component: AvisBoutiqueComponent;
  let fixture: ComponentFixture<AvisBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisBoutiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisBoutiqueComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
