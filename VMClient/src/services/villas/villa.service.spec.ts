import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { VillaService } from './villa.service';

describe('VillaService', () => {
  let service: VillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting() // ✅ ONLY THIS
      ]
    });

    service = TestBed.inject(VillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});