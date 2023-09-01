import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdditionalCostComponent} from './additionalcost.component';

describe('AdditionalcostsComponent', () => {
  let component: AdditionalCostComponent;
  let fixture: ComponentFixture<AdditionalCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalCostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
