import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GlobalMarketReturnComponent as GlobalMarketReturnComponent} from './globalmarketreturn.component';

describe('GlobalmarketreturnComponent', () => {
  let component: GlobalMarketReturnComponent;
  let fixture: ComponentFixture<GlobalMarketReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalMarketReturnComponent],
    });
    fixture = TestBed.createComponent(GlobalMarketReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
