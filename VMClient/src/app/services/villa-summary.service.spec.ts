import { TestBed } from '@angular/core/testing';

import { VillaSummaryService } from './villa-summary.service';

describe('VillaSummaryService', () => {
  let service: VillaSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VillaSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
