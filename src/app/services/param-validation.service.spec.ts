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

        let paramString = 'donation';
        let isValid: boolean = srvc.isTypeParamValid(paramString);
        expect(isValid).toBe(true);

    }));

    it('should consider "payment" a valid type', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let paramString = 'payment';
        let isValid: boolean = srvc.isTypeParamValid(paramString);
        expect(isValid).toBe(true);
    }));

    it('should consider NULL an invalid type', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let paramString = null;
        let isValid: boolean = srvc.isTypeParamValid(paramString);
        expect(isValid).toBe(false);
    }));

    it('should consider UNDEFINED an invalid type', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let paramString: string = undefined;
        let isValid: boolean = srvc.isTypeParamValid(paramString);
        expect(isValid).toBe(false);

    }));

    it('should consider "12345" a valid invoice id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let invoiceId = '12345';
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
        expect(isValid).toBe(true);

    }));

    it('should consider "12.55" an invalid invoice id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let invoiceId = '12.55';
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
        expect(isValid).toBe(false);

    }));

    it('should consider "someString" an invalid invoice id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let invoiceId = 'someString';
        let isValid: boolean = srvc.isInvoiceIdValid(invoiceId);
        expect(isValid).toBe(false);

    }));

    it('should fail if totalCostParam is a not a decimal', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost = '123abc';
        let isValid: boolean = srvc.isInvoiceIdValid(totalCost);
        expect(isValid).toBe(false);

    }));

    it('should succeed if totalCostParam is a decimal', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost = '12.55';
        let isValid: boolean = srvc.isTotalCostValid(totalCost);
        expect(isValid).toBe(true);

    }));

    it('should succeed if totalCostParam is a decimal with leading 0',
        inject([ParamValidationService], (srvc: ParamValidationService) => {

        let totalCost = '0.55';

        let isValid: boolean = srvc.isTotalCostValid(totalCost);

        expect(isValid).toBe(true);

    }));

    it('should succeed if minPaymentParam is a decimal ',
        inject([ParamValidationService], (srvc: ParamValidationService) => {
            let minPayment = '12.55';
            let totalCost = '500';
            let isValid: boolean = srvc.isMinPaymentValid(minPayment, totalCost);
            expect(isValid).toBe(true);
    }));

    it('should fail if minPaymentParam is more than total cost ',
        inject([ParamValidationService], (srvc: ParamValidationService) => {
            let minPayment = '555';
            let totalCost = '500';
            let isValid: boolean = srvc.isMinPaymentValid(minPayment, totalCost);
            expect(isValid).toBe(false);
    }));

    it('should fail if title is empty string ',
        inject([ParamValidationService], (srvc: ParamValidationService) => {
            let title = '';
            let isValid: boolean = srvc.isTitleValid(title);
            expect(isValid).toBe(false);
    }));

    it('should consider "12345" a valid fund id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let fundId = '12345';
        let isValid: boolean = srvc.isFundIdValid(fundId);
        expect(isValid).toBe(true);

    }));

    it('should consider "5.05" an invalid fund id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let fundId = '5.05';
        let isValid: boolean = srvc.isFundIdValid(fundId);
        expect(isValid).toBe(false);

    }));

    it('should consider "someString" an invalid fund id', inject([ParamValidationService], (srvc: ParamValidationService) => {

        let fundId = 'someString';
        let isValid: boolean = srvc.isFundIdValid(fundId);
        expect(isValid).toBe(false);

    }));

    it('should route to the correct verify function from isValidParam and return false',
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

    it('should route to the correct verify function from isValidParam and return true',
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

    it('should return true for required payment params',
        inject([ParamValidationService], (srvc: ParamValidationService) => {

        let isInoviceIdReq: any = srvc.isParamRequired(srvc.embedParamNames.invoice_id, srvc.flowTypes.payment);
        let isTotalCostReq: any = srvc.isParamRequired(srvc.embedParamNames.total_cost, srvc.flowTypes.payment);
        let isMinPmtReq: any = srvc.isParamRequired(srvc.embedParamNames.min_payment, srvc.flowTypes.payment);

        let allRequiredParamsReturnTrue = isInoviceIdReq && isTotalCostReq && isMinPmtReq;

        expect(allRequiredParamsReturnTrue).toBe(true);

    }));

    it('should return false for donation params (none are required)',
        inject([ParamValidationService], (srvc: ParamValidationService) => {

            let isInoviceIdReq: any = srvc.isParamRequired(srvc.embedParamNames.invoice_id, srvc.flowTypes.donation);
            let isTotalCostReq: any = srvc.isParamRequired(srvc.embedParamNames.total_cost, srvc.flowTypes.donation);
            let isMinPmtReq: any = srvc.isParamRequired(srvc.embedParamNames.min_payment, srvc.flowTypes.donation);

            let allRequiredParamsReturnFalse = !isInoviceIdReq && !isTotalCostReq && !isMinPmtReq;

            expect(allRequiredParamsReturnFalse).toBe(true);

    }));

    it('should return false for pmt params that are not required',
        inject([ParamValidationService], (srvc: ParamValidationService) => {

            let isTitleReq: any = srvc.isParamRequired(srvc.embedParamNames.title, srvc.flowTypes.payment);
            let isUrlReq: any = srvc.isParamRequired(srvc.embedParamNames.url, srvc.flowTypes.payment);
            let isFundIdReq: any = srvc.isParamRequired(srvc.embedParamNames.fund_id, srvc.flowTypes.payment);

            let noneOfTheParamsRequired = !isTitleReq && !isUrlReq && !isFundIdReq;

            expect(noneOfTheParamsRequired).toBe(true);

        }));

});
