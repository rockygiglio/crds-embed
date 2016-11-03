import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Response, HttpModule, Http, XHRBackend} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {ExistingPaymentInfoService} from './existing-payment-info.service';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';
import { CookieService } from 'angular2-cookie/core';


describe('Quick Donation Amounts Service', () => {

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

    it('it should fetch previous payment info',
        async(inject([ExistingPaymentInfoService], (ExistingPaymentInfoService) => {
            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                                body: 42
                            }
                        )));
                });

            ExistingPaymentInfoService.getExistingPaymentInfo('123abc').subscribe(
                (data) => {
                    expect(data).toBe(42);
                });
        }))
    );

});
