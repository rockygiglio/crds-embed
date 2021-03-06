import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, Http, XHRBackend } from '@angular/http';

import { MockBackend } from '@angular/http/testing';
import { SessionService } from './session.service';
import { CookieService } from 'angular2-cookie/core';
import { ValidationService } from './validation.service';


describe('Service: Validation', () => {

  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        SessionService,
        CookieService,
        ValidationService,
        {
          provide:    Http,
          deps:       [MockBackend, BaseRequestOptions],
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ],
      imports:   [
        HttpModule
      ]
    });

    mockBackend = getTestBed().get(MockBackend);
    TestBed.compileComponents();
  });

  it('should consider "donation" a valid type', inject([ValidationService], (srvc: ValidationService) => {

    let paramString      = 'donation';
    let isValid: boolean = srvc.isTypeParamValid(paramString);
    expect(isValid).toBe(true);

  }));

  it('should consider "payment" a valid type', inject([ValidationService], (srvc: ValidationService) => {

    let paramString      = 'payment';
    let isValid: boolean = srvc.isTypeParamValid(paramString);
    expect(isValid).toBe(true);
  }));

  it('should consider NULL an invalid type', inject([ValidationService], (srvc: ValidationService) => {

    let paramString      = null;
    let isValid: boolean = srvc.isTypeParamValid(paramString);
    expect(isValid).toBe(false);
  }));

  it('should consider UNDEFINED an invalid type', inject([ValidationService], (srvc: ValidationService) => {

    let paramString: string = undefined;
    let isValid: boolean    = srvc.isTypeParamValid(paramString);
    expect(isValid).toBe(false);

  }));

  it('should consider "12345" a valid invoice id', inject([ValidationService], (srvc: ValidationService) => {

    let invoiceId        = '12345';
    let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
    expect(isValid).toBe(true);

  }));

  it('should consider "12.55" an invalid invoice id', inject([ValidationService], (srvc: ValidationService) => {

    let invoiceId        = '12.55';
    let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
    expect(isValid).toBe(false);

  }));

  it('should consider "someString" an invalid invoice id', inject([ValidationService], (srvc: ValidationService) => {

    let invoiceId        = 'someString';
    let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
    expect(isValid).toBe(false);

  }));

  it('should fail if totalCostParam is a not a decimal', inject([ValidationService], (srvc: ValidationService) => {

    let totalCost        = '123abc';
    let isValid: boolean = srvc.isInvoiceIdValid(totalCost);
    expect(isValid).toBe(false);

  }));

  it('should succeed if totalCostParam is a decimal', inject([ValidationService], (srvc: ValidationService) => {

    let totalCost        = '12.55';
    let isValid: boolean = srvc.isTotalCostValid(totalCost);
    expect(isValid).toBe(true);

  }));

  it('should succeed if totalCostParam is a decimal with leading 0',
    inject([ValidationService], (srvc: ValidationService) => {

      let totalCost = '0.55';

      let isValid: boolean = srvc.isTotalCostValid(totalCost);

      expect(isValid).toBe(true);

    }));

  it('should succeed if minPaymentParam is a decimal ',
    inject([ValidationService], (srvc: ValidationService) => {
      let minPayment       = '12.55';
      let totalCost        = '500';
      let isValid: boolean = srvc.isMinPaymentValid(minPayment, totalCost);
      expect(isValid).toBe(true);
    }));

  it('should fail if minPaymentParam is more than total cost ',
    inject([ValidationService], (srvc: ValidationService) => {
      let minPayment       = '555';
      let totalCost        = '500';
      let isValid: boolean = srvc.isMinPaymentValid(minPayment, totalCost);
      expect(isValid).toBe(false);
    }));

  it('should fail if title is empty string ',
    inject([ValidationService], (srvc: ValidationService) => {
      let title            = '';
      let isValid: boolean = srvc.isTitleValid(title);
      expect(isValid).toBe(false);
    }));

  it('should consider "12345" a valid fund id', inject([ValidationService], (srvc: ValidationService) => {

    let fundId           = '12345';
    let isValid: boolean = srvc.isFundIdValid(fundId);
    expect(isValid).toBe(true);

  }));

  it('should consider "5.05" an invalid fund id', inject([ValidationService], (srvc: ValidationService) => {

    let fundId           = '5.05';
    let isValid: boolean = srvc.isFundIdValid(fundId);
    expect(isValid).toBe(false);

  }));

  it('should consider "someString" an invalid fund id', inject([ValidationService], (srvc: ValidationService) => {

    let fundId           = 'someString';
    let isValid: boolean = srvc.isFundIdValid(fundId);
    expect(isValid).toBe(false);

  }));

  it('should route to the correct verify function from isValidParam and return false',
    inject([ValidationService], (srvc: ValidationService) => {

      let queryParamsWithInvalidMinPmt: any = {
        type:        'payment',
        invoice_id:  '123',
        total_cost:  '12.50',
        min_payment: '100.00',
        title:       'testTitle',
        url:         'https://www.test.com',
        fund_id:     '50'
      };

      let isValid: boolean = srvc.isValidParam('min_payment', queryParamsWithInvalidMinPmt.min_payment, queryParamsWithInvalidMinPmt);
      expect(isValid).toBe(false);

    }));

  it('should route to the correct verify function from isValidParam and return true',
    inject([ValidationService], (srvc: ValidationService) => {

      let validQueryParams: any = {
        type:        'payment',
        invoice_id:  '123',
        total_cost:  '12.50',
        min_payment: '3.00',
        title:       'testTitle',
        url:         'https://www.test.com',
        fund_id:     '50'
      };

      let isValid: boolean = srvc.isValidParam('min_payment', validQueryParams.min_payment, validQueryParams);
      expect(isValid).toBe(true);

    }));

  it('should return true for required payment params',
    inject([ValidationService], (srvc: ValidationService) => {

      let isInoviceIdReq: any = srvc.isParamRequired(srvc.params.invoice_id, srvc.types.payment);
      let isTotalCostReq: any = srvc.isParamRequired(srvc.params.total_cost, srvc.types.payment);
      let isMinPmtReq: any = srvc.isParamRequired(srvc.params.min_payment, srvc.types.payment);

      let allRequiredParamsReturnTrue = isInoviceIdReq && isTotalCostReq && isMinPmtReq;

      expect(allRequiredParamsReturnTrue).toBe(true);

    }));

  it('should return false for donation params (none are required)',
    inject([ValidationService], (srvc: ValidationService) => {

      let isInoviceIdReq: any = srvc.isParamRequired(srvc.params.invoice_id, srvc.types.donation);
      let isTotalCostReq: any = srvc.isParamRequired(srvc.params.total_cost, srvc.types.donation);
      let isMinPmtReq: any    = srvc.isParamRequired(srvc.params.min_payment, srvc.types.donation);

      let allRequiredParamsReturnFalse = !isInoviceIdReq && !isTotalCostReq && !isMinPmtReq;

      expect(allRequiredParamsReturnFalse).toBe(true);

    }));

  it('should return false for pmt params that are not required',
    inject([ValidationService], (srvc: ValidationService) => {

      let isTitleReq: any  = srvc.isParamRequired(srvc.params.title, srvc.types.payment);
      let isUrlReq: any    = srvc.isParamRequired(srvc.params.url, srvc.types.payment);
      let isFundIdReq: any = srvc.isParamRequired(srvc.params.fund_id, srvc.types.payment);

      let noneOfTheParamsRequired = !isTitleReq && !isUrlReq && !isFundIdReq;

      expect(noneOfTheParamsRequired).toBe(true);

    }));

});
