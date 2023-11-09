import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CountryMapComponent} from './countrymap.component';

describe('CountrymapComponent', () => {
  let component: CountryMapComponent;
  let fixture: ComponentFixture<CountryMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountryMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
