import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyGrowthComponent} from './propertygrowth.component';

describe('PropertygrowthComponent', () => {
  let component: PropertyGrowthComponent;
  let fixture: ComponentFixture<PropertyGrowthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyGrowthComponent],
    });
    fixture = TestBed.createComponent(PropertyGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
