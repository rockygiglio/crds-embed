/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GiftService } from './gift.service';
import { ActivatedRoute } from '@angular/router';
import { ParamValidationService } from './param-validation.service';
import { DonationFundService, Program } from './donation-fund.service';
import { CrdsCookieService } from './crds-cookie.service';
import { UserAuthenticationService } from './user-authentication.service';
import { PreviousGiftAmountService } from './previous-gift-amount.service';
import { QuickDonationAmountsService } from './quick-donation-amounts.service';
import { HttpClientService } from './http-client.service';
import { StateManagerService } from './state-manager.service';
import { ExistingPaymentInfoService, PaymentInfo } from './existing-payment-info.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { CookieService } from 'angular2-cookie/core';


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
        ParamValidationService,
        DonationFundService,
        CrdsCookieService,
        UserAuthenticationService,
        PreviousGiftAmountService,
        ExistingPaymentInfoService,
        QuickDonationAmountsService,
        HttpClientService,
        StateManagerService,
        CookieService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
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
