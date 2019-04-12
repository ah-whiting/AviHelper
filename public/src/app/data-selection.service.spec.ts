import { TestBed } from '@angular/core/testing';

import { DataSelectionService } from './data-selection.service';

describe('DataSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSelectionService = TestBed.get(DataSelectionService);
    expect(service).toBeTruthy();
  });
});
