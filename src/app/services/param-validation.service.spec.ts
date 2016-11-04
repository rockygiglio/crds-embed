import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, Http, XHRBackend } from '@angular/http';

import { MockBackend } from '@angular/http/testing';
import { ExistingPaymentInfoService } from './existing-payment-info.service';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';
import { CookieService } from 'angular2-cookie/core';
import { ParamValidationService } from './param-validation.service';


describe('ParamValidationService', () => {

    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                ExistingPaymentInfoService,
                MockBackend,
                BaseRequestOptions,
                HttpClientService,
                UserSessionService,
                CookieService,
                ParamValidationService,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ],
            imports: [
                HttpModule
            ]
        });

        mockBackend = getTestBed().get(MockBackend);
        TestBed.compileComponents();
    }));

    it('should consider "donation" a valid type', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let paramString: string = 'donation';
        let isValid: boolean = srvc.isTypeValid(paramString);
        expect(isValid).toBe(true);

    }));

    it('should consider "payment" a valid type', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let paramString: string = 'payment';
        let isValid: boolean = srvc.isTypeValid(paramString);
        expect(isValid).toBe(true);
    }));

    it('should consider NULL an invalid type', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let paramString: string = null;
        let isValid: boolean = srvc.isTypeValid(paramString);
        expect(isValid).toBe(false);
    }));

    it('should consider UNDEFINED an invalid type', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let paramString: string = undefined;
        let isValid: boolean = srvc.isTypeValid(paramString);
        expect(isValid).toBe(false);

    }));

    it('should consider "12345" a valid invoice id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let invoiceId: string = '12345';
        let type: string = 'donation';
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId, type);
        expect(isValid).toBe(true);

    }));

    it('should consider "someString" an invalid invoice id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let invoiceId: string = 'someString';
        let type: string = 'donation';
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId, type);
        expect(isValid).toBe(false);

    }));

    it('should fail if invalid typeParam is passed', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let invoiceId: string = 'someString';
        let type: string = '123abc';
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId, type);
        expect(isValid).toBe(false);

    }));

    it('should fail if totalCostParam is a not a decimal', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost: string = '123abc';
        let type: string = 'donation';

        let isValid: boolean = srvc.isInvoiceIdValid(totalCost, type);

        expect(isValid).toBe(false);

    }));

    it('should succeed if totalCostParam is a decimal', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost: string = '12.55';
        let type: string = 'donation';

        let isValid: boolean = srvc.isInvoiceIdValid(totalCost, type);

        expect(isValid).toBe(true);

    }));

    it('should succeed if totalCostParam is a decimal with leading o',
        inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost: string = '0.55';
        let type: string = 'donation';

        let isValid: boolean = srvc.isInvoiceIdValid(totalCost, type);

        expect(isValid).toBe(true);

    }));

});
