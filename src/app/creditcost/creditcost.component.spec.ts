import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreditCostComponent} from './creditcost.component';

describe('CreditecostComponent', () => {
  let component: CreditCostComponent;
  let fixture: ComponentFixture<CreditCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditCostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
