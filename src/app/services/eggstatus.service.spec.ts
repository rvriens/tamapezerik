import { TestBed } from '@angular/core/testing';

import { EggstatusService } from './eggstatus.service';

describe('EggstatusService', () => {
  let service: EggstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EggstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
