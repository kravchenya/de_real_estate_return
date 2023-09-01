import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CitystatisticsComponent} from './citystatistics.component';

describe('CitystatisticsComponent', () => {
  let component: CitystatisticsComponent;
  let fixture: ComponentFixture<CitystatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitystatisticsComponent],
    });
    fixture = TestBed.createComponent(CitystatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
