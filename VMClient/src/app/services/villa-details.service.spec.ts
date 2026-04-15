import { TestBed } from '@angular/core/testing';

import { VillaDetailsService } from './villa-details.service';

describe('VillaDetailsService', () => {
  let service: VillaDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VillaDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
