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
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
        expect(isValid).toBe(true);

    }));

    it('should consider "someString" an invalid invoice id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let invoiceId: string = 'someString';
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
        expect(isValid).toBe(false);

    }));

    it('should fail if totalCostParam is a not a decimal', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost: string = '123abc';
        let isValid: boolean = srvc.isInvoiceIdValid(totalCost);
        expect(isValid).toBe(false);

    }));

    it('should succeed if totalCostParam is a decimal', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost: string = '12.55';
        let isValid: boolean = srvc.isInvoiceIdValid(totalCost);
        expect(isValid).toBe(true);

    }));

    it('should succeed if totalCostParam is a decimal with leading 0',
        inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost: string = '0.55';

        let isValid: boolean = srvc.isInvoiceIdValid(totalCost);

        expect(isValid).toBe(true);

    }));

    it('should succeed if minPaymentParam is a decimal ',
        inject([ParamValidationService], (srvc: ParamValidationService) => {
            let minPayment: string = '12.55';
            let totalCost = '500';
            let isValid: boolean = srvc.isMinPaymentValid(minPayment, totalCost);
            expect(isValid).toBe(true);
    }));

    it('should fail if minPaymentParam is more than total cost ',
        inject([ParamValidationService], (srvc: ParamValidationService) => {
            let minPayment: string = '555';
            let totalCost = '500';
            let isValid: boolean = srvc.isMinPaymentValid(minPayment, totalCost);
            expect(isValid).toBe(false);
    }));

    it('should fail if title is empty string ',
        inject([ParamValidationService], (srvc: ParamValidationService) => {
            let title: string = '';
            let isValid: boolean = srvc.isTitleValid(title);
            expect(isValid).toBe(false);
    }));

    it('should consider "12345" a valid fund id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let fundId: string = '12345';
        let isValid: boolean = srvc.isFundIdValid(fundId);
        expect(isValid).toBe(true);

    }));

    it('should consider "someString" an invalid fund id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let fundId: string = 'someString';
        let isValid: boolean = srvc.isFundIdValid(fundId);
        expect(isValid).toBe(false);

    }));

    fit('should route to the correct verify function from isValidParam and return false',
        inject([ParamValidationService], (srvc: ParamValidationService) => {

        let queryParamsWithInvalidMinPmt: any = {
            type: 'payment',
            invoice_id: '123',
            total_cost: '12.50',
            min_payment: '100.00',
            title: 'testTitle',
            url: 'https://www.test.com',
            fund_id: '50'
        };

        let isValid: boolean = srvc.isValidParam('min_payment', queryParamsWithInvalidMinPmt.min_payment, queryParamsWithInvalidMinPmt);
        expect(isValid).toBe(false);

    }));

    fit('should route to the correct verify function from isValidParam and return true',
    inject([ParamValidationService], (srvc: ParamValidationService) => {

        let validQueryParams: any = {
            type: 'payment',
            invoice_id: '123',
            total_cost: '12.50',
            min_payment: '3.00',
            title: 'testTitle',
            url: 'https://www.test.com',
            fund_id: '50'
        };

        let isValid: boolean = srvc.isValidParam('min_payment', validQueryParams.min_payment, validQueryParams);
        expect(isValid).toBe(true);

    }));

});
