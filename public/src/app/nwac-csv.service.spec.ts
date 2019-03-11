import { TestBed } from '@angular/core/testing';

import { NwacCsvService } from './nwac-csv.service';

describe('NwacCsvService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NwacCsvService = TestBed.get(NwacCsvService);
    expect(service).toBeTruthy();
  });
});
