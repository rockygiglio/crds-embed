/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GiftService } from './gift.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerBank } from '../models/customer-bank';
import { ParamValidationService } from './param-validation.service';
import { DonationFundService, Program } from './donation-fund.service';
import { PreviousGiftAmountService } from './previous-gift-amount.service';
import { QuickDonationAmountsService } from './quick-donation-amounts.service';
import { HttpClientService } from './http-client.service';
import { LoginService } from './login.service';
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

  const userBank = new CustomerBank('US', 'USD', 12345, 12345678, 'Bob Smith', 'cc');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiftService,
        ParamValidationService,
        DonationFundService,
        PreviousGiftAmountService,
        ExistingPaymentInfoService,
        QuickDonationAmountsService,
        HttpClientService,
        LoginService,
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

  it('should clear payment data', inject([GiftService], (srvc: GiftService) => {
    srvc.userBank = userBank;
    srvc.clearUserPmtInfo();
    expect(srvc.userBank).toBe(undefined);
  }));

  it('should indicate that gift is a one time gift', inject([GiftService], (srvc: GiftService) => {
    srvc.frequency = 'One Time';
    expect(srvc.isOneTimeGift()).toBe(true);
  }));

  it('should indicate that gift is NOT a one time gift', inject([GiftService], (srvc: GiftService) => {
    srvc.frequency = 'week';
    expect(srvc.isOneTimeGift()).toBe(false);
  }));

  it('should return false if one time gift', inject([GiftService], (srvc: GiftService) => {
    srvc.frequency = 'One Time';
    srvc.start_date = new Date();
    expect(srvc.isRecurringGiftWithNoStartDate()).toBe(false);
  }));

  it('should return true if recurring gift w/ missing date', inject([GiftService], (srvc: GiftService) => {
    srvc.frequency = 'week';
    srvc.start_date = undefined;
    expect(srvc.isRecurringGiftWithNoStartDate()).toBe(true);
  }));

  it('should return false if recurring and date is set', inject([GiftService], (srvc: GiftService) => {
    srvc.frequency = 'week';
    srvc.start_date = new Date();
    expect(srvc.isRecurringGiftWithNoStartDate()).toBe(false);
  }));

  describe('#isFrequencySelected', () => {
    it('should return false if frequency is NOT set', inject([GiftService], (srvc: GiftService) => {
      srvc.frequency = '';
      expect(srvc.isFrequencySelected()).toBe(false);
    }));

    it('should return true if frequency IS set', inject([GiftService], (srvc: GiftService) => {
      srvc.frequency = 'week';
      expect(srvc.isFrequencySelected()).toBe(true);
    }));
  });

  describe('#isFrequencySetAndNotOneTime', () => {
    it('should return false if frequency is NOT set', inject([GiftService], (srvc: GiftService) => {
      srvc.frequency = '';
      expect(srvc.isFrequencySetAndNotOneTime()).toBe(false);
    }));

    it('should return true if frequency IS set to recurring', inject([GiftService], (srvc: GiftService) => {
      srvc.frequency = 'week';
      expect(srvc.isFrequencySetAndNotOneTime()).toBe(true);
    }));

    it('should return false if frequency is set to "One Time"', inject([GiftService], (srvc: GiftService) => {
      srvc.frequency = 'One Time';
      expect(srvc.isFrequencySetAndNotOneTime()).toBe(false);
    }));
  });

});
