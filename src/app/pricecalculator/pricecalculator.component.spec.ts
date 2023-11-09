import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PriceCalculatorComponent} from './pricecalculator.component';

describe('PricecalculatorComponent', () => {
  let component: PriceCalculatorComponent;
  let fixture: ComponentFixture<PriceCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriceCalculatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
