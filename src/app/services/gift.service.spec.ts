/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GiftService } from './gift.service';
import { ActivatedRoute } from "@angular/router";

class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Service: Gift', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiftService,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    });
  });

  it('should validate payment amount', inject([GiftService], (service: GiftService) => {
    service.minPayment = 100.00;
    service.totalCost  = 400.00;
    service.type = 'payment';
    service.amount = 1;

    expect(service.validAmount()).toBe(false);

    service.amount = 150.00;
    expect(service.validAmount()).toBe(true);

    service.amount = 500.00;
    expect(service.validAmount()).toBe(false);

  }));
});
