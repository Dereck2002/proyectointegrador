import { TestBed } from '@angular/core/testing';

import { ServisioService } from './servisio.service';

describe('ServisioService', () => {
  let service: ServisioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServisioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
