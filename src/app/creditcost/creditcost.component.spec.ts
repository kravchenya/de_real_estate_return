import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreditcostComponent} from './creditcost.component';

describe('CreditecostComponent', () => {
  let component: CreditcostComponent;
  let fixture: ComponentFixture<CreditcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditcostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
