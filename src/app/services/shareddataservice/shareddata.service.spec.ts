import {TestBed} from '@angular/core/testing';

import {SharedDataService} from './shareddata.service';

describe('ShareddataService', () => {
  let service: SharedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
