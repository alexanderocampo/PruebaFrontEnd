import { TestBed } from '@angular/core/testing';

import { Mock } from './mock';

describe('Mock', () => {
  let service: Mock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
