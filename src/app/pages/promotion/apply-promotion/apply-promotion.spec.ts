import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyPromotionComponent } from './apply-promotion';

describe('ApplyPromotionComponent', () => {
  let component: ApplyPromotionComponent;
  let fixture: ComponentFixture<ApplyPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyPromotionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
