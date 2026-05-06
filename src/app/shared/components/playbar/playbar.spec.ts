import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playbar } from './playbar';

describe('Playbar', () => {
  let component: Playbar;
  let fixture: ComponentFixture<Playbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playbar],
    }).compileComponents();

    fixture = TestBed.createComponent(Playbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
