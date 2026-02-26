import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acheteur } from './acheteur';

describe('Acheteur', () => {
  let component: Acheteur;
  let fixture: ComponentFixture<Acheteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acheteur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acheteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
