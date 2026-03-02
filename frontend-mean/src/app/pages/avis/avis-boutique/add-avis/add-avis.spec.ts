import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAvisBoutiqueComponent } from './add-avis';

describe('AddAvisBoutiqueComponent', () => {
  let component: AddAvisBoutiqueComponent;
  let fixture: ComponentFixture<AddAvisBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAvisBoutiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvisBoutiqueComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
