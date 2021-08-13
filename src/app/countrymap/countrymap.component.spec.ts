import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrymapComponent } from './countrymap.component';

describe('CountrymapComponent', () => {
  let component: CountrymapComponent;
  let fixture: ComponentFixture<CountrymapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountrymapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrymapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
