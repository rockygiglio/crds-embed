import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { DonationService } from './donation.service';
import { ExistingPaymentInfoService } from './existing-payment-info.service';
import { StoreService } from './store.service';
import { HttpClientService } from './http-client.service';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import { ParamValidationService } from './param-validation.service';
import { PaymentService } from './payment.service';
import { RecurringDonor } from '../models/recurring-donor';
import { StateManagerService } from './state-manager.service';
import { StripeService } from './stripe.service';

class MockActivatedRoute {
    public snapshot = {
        queryParams: []
    };
}

class MockStripeService {

    public getCardInfoToken(customerCard: CustomerCard ): Observable<any> {
        return Observable.of({
            id: 'tok_u5dg20Gra',
            card: {last4: 0987},
            created: 1479313527,
            currency: 'usd',
            livemode: false,
            object: 'token',
            used: false
        });
    };
    public getBankInfoToken(customerBank: CustomerBank ): Observable<any> {
        return Observable.of({
            id: 'tok_u5dg20Gra',
            bank: {last4: 0987},
            created: 1479313527,
            currency: 'usd',
            livemode: false,
            object: 'token',
            used: false
        });
    };
}

describe('Service: Previous Gift Amount', () => {

    let mockBackend: MockBackend;

    let mockRecurringDonation: RecurringDonor = new RecurringDonor('tok_123', 25, '12', 'week', '2017-02-05');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                CookieService,
                BaseRequestOptions,
                DonationService,
                ExistingPaymentInfoService,
                StoreService,
                HttpClientService,
                LoginService,
                MockBackend,
                ParamValidationService,
                PaymentService,
                StateManagerService,
                { provide: StripeService, useClass: MockStripeService},
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                { provide: ActivatedRoute, useClass: MockActivatedRoute }

            ],
            imports: [
                HttpModule
            ]
        });

        mockBackend = getTestBed().get(MockBackend);
        TestBed.compileComponents();
    }));

    it('it should make a post recurring gift call',
        async(inject([DonationService, MockBackend], (srvc) => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockRecurringDonation
                        })
                    ));
                });

            srvc.postRecurringGift(mockRecurringDonation).subscribe(
                (data) => {
                    expect(data.interval).toBe('week');
                }
            );
        }))
    );

});
