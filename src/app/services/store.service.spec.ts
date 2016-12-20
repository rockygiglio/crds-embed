/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreService } from './store.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerBank } from '../models/customer-bank';
import { Frequency } from '../models/frequency';
import { ValidationService } from './validation.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { IFrameParentService } from './iframe-parent.service';
import { APIService } from './api.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { CookieService } from 'angular2-cookie/core';


class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Service: Store', () => {

  const userBank = new CustomerBank('US', 'USD', 12345, 12345678, 'Bob Smith', 'cc');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IFrameParentService,
        StoreService,
        ValidationService,
        APIService,
        SessionService,
        StateService,
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

  it('should validate payment amount', inject([StoreService], (service: StoreService) => {
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

  it('should clear payment data', inject([StoreService], (srvc: StoreService) => {
    srvc.userBank = userBank;
    srvc.clearUserPmtInfo();
    expect(srvc.userBank).toBe(undefined);
  }));

  it('should indicate that gift is a one time gift', inject([StoreService], (srvc: StoreService) => {
    srvc.frequency = new Frequency('One Time', 'once', false);
    expect(srvc.isOneTimeGift()).toBe(true);
  }));

  it('should indicate that gift is NOT a one time gift', inject([StoreService], (srvc: StoreService) => {
    srvc.frequency = new Frequency('weekly', 'week', true);
    expect(srvc.isOneTimeGift()).toBe(false);
  }));

  it('should return false if one time gift', inject([StoreService], (srvc: StoreService) => {
    srvc.frequency = new Frequency('One Time', 'once', false);
    srvc.startDate = new Date();
    expect(srvc.isRecurringGiftWithNoStartDate()).toBe(false);
  }));

  it('should return true if recurring gift w/ missing date', inject([StoreService], (srvc: StoreService) => {
    srvc.frequency = new Frequency('weekly', 'week', true);
    srvc.startDate = undefined;
    expect(srvc.isRecurringGiftWithNoStartDate()).toBe(true);
  }));

  it('should return false if recurring and date is set', inject([StoreService], (srvc: StoreService) => {
    srvc.frequency = new Frequency('weekly', 'week', true);
    srvc.startDate = new Date();
    expect(srvc.isRecurringGiftWithNoStartDate()).toBe(false);
  }));

  describe('#isFrequencySelected', () => {
    it('should return false if frequency is NOT set', inject([StoreService], (srvc: StoreService) => {
      srvc.frequency = null;
      expect(srvc.isFrequencySelected()).toBe(false);
    }));

    it('should return true if frequency IS set', inject([StoreService], (srvc: StoreService) => {
      srvc.frequency = new Frequency('weekly', 'week', true);
      expect(srvc.isFrequencySelected()).toBe(true);
    }));
  });

  describe('#isFrequencySetAndNotOneTime', () => {
    it('should return false if frequency is NOT set', inject([StoreService], (srvc: StoreService) => {
      srvc.frequency = null;
      expect(srvc.isFrequencySetAndNotOneTime()).toBe(false);
    }));

    it('should return true if frequency IS set to recurring', inject([StoreService], (srvc: StoreService) => {
      srvc.frequency = new Frequency('weekly', 'week', true);
      expect(srvc.isFrequencySetAndNotOneTime()).toBe(true);
    }));

    it('should return false if frequency is set to "once"', inject([StoreService], (srvc: StoreService) => {
      srvc.frequency = new Frequency('One Time', 'once', false);
      expect(srvc.isFrequencySetAndNotOneTime()).toBe(false);
    }));
  });

});
