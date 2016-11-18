
import { BaseRequestOptions, HttpModule, Http, XHRBackend } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { MockBackend } from '@angular/http/testing';
import { FundsService } from './funds.service';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';

import { ExistingPaymentInfoService } from '../existing-payment-info.service';
import { HttpClientService } from '../http-client.service';
import { Program } from '../../interfaces/program';


describe('Service: Funds', () => {


    public mockFunds: Array<Program> = [
        {
            "ProgramId": 3,
            "Name": "General Giving",
            "ProgramType": 1,
            "AllowRecurringGiving": true
        },
        {
            "ProgramId": 146,
            "Name": "I'm In",
            "ProgramType": 1,
            "AllowRecurringGiving": true
        },
        {
            "ProgramId": 392,
            "Name": "(t) Test Pledge Program1",
            "ProgramType": 1,
            "AllowRecurringGiving": false
        },
        {
            "ProgramId": 393,
            "Name": "(t) Test Pledge Program2",
            "ProgramType": 1,
            "AllowRecurringGiving": true
        }
    ];

    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                CookieService,
                ExistingPaymentInfoService,
                HttpClientService,
                MockBackend,
                FundsService,
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
    }));

    it('PLACEHOLDER', inject([FundsService], (srvc: FundsService) => {

        expect(true).toBe(true);

    }));


});
