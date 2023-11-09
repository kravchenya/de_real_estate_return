import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyaffordabilityComponent} from './propertyaffordability.component';

describe('PropertyaffordabilityComponent', () => {
  let component: PropertyaffordabilityComponent;
  let fixture: ComponentFixture<PropertyaffordabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyaffordabilityComponent],
    });
    fixture = TestBed.createComponent(PropertyaffordabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
