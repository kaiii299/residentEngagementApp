import { TestBed } from '@angular/core/testing';

import { RequestNewUserService } from './request-new-user.service';

describe('RequestNewUserService', () => {
  let service: RequestNewUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestNewUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
