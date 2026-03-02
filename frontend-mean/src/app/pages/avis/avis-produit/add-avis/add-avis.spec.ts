import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAvisProduitComponent } from './add-avis';

describe('AddAvisProduitComponent', () => {
  let component: AddAvisProduitComponent;
  let fixture: ComponentFixture<AddAvisProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAvisProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvisProduitComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
