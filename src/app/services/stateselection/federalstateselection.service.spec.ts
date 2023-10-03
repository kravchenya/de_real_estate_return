import {TestBed} from '@angular/core/testing';

import {FederalStateSelectionService} from './federalstateselection.service';

describe('MapserviceService', () => {
  let service: FederalStateSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FederalStateSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
