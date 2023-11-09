import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyAffordabilityComponent} from './propertyaffordability.component';

describe('PropertyaffordabilityComponent', () => {
  let component: PropertyAffordabilityComponent;
  let fixture: ComponentFixture<PropertyAffordabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyAffordabilityComponent],
    });
    fixture = TestBed.createComponent(PropertyAffordabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
