import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wrapper } from './wrapper';

describe('Wrapper', () => {
  let component: Wrapper;
  let fixture: ComponentFixture<Wrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(Wrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
