/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GiftService } from './gift.service';

describe('Service: Gift', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GiftService]
    });
  });

  it('should ...', inject([GiftService], (service: GiftService) => {
    expect(service).toBeTruthy();
  }));
});
