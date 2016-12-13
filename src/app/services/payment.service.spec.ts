import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';

import { CustomerBank } from '../models/customer-bank';
import { StoreService } from './store.service';
import { SessionService } from './session.service';
import { ValidationService } from './validation.service';
import { Payment} from '../models/payment';
import { PaymentService } from './payment.service';
import { StateService } from './state.service';

class MockActivatedRoute {
    public snapshot = {
        queryParams: []
    };
}

describe('Service: Payment', () => {

    let mockBackend: MockBackend;
    let mockDonor = '{"stripe_token": 123,"email_address":"test@test.com","first_name":"John","last_name":"Doe", "rest_method":"post"}';
    let mockBank =  new CustomerBank('US', 'USD', 110000000, parseInt('000123456789', 10), 'Jane Austen', 'individual');
    let mockPaymentTypeBody = new Payment('', 1, 'bank', 'PAYMENT', 123);
    let mockPostPaymentResp = '{"amount":1,"email":"scrudgemcduckcrds@mailinator.com","status":0,"include_on_giving_h'
    + 'istory":false,"include_on_printed_statement":false,"date":"0001-01-01T00:00:00","fee":0.0,"payment_id":125,"'
    + 'source":{"type":0},"distributions":[]}';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                MockBackend,
                SessionService,
                BaseRequestOptions,
                ValidationService,
                PaymentService,
                StateService,
                StoreService,
                CookieService,
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


    it('it should get donor information when passed a donor email',
        async(inject([PaymentService, MockBackend], (srvc, backend) => {

            backend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockDonor
                        })
                    ));
                });

            srvc.getDonor().subscribe(
                (data) => {
                    expect(data.stripe_token).toBe(123);
                }
            );
        }))
    );

    it('it should make a post payment call',
        async(inject([PaymentService, MockBackend], (srvc, backend) => {

            backend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockPostPaymentResp
                        })
                    ));
                });

            srvc.postPayment(mockPaymentTypeBody).subscribe(
                (data) => {
                    expect(data.amount).toBe(1);
                }
            );
        }))
    );

    it('it should make an API call to post a donor',
        async(inject([PaymentService, MockBackend], (srvc, backend) => {

            backend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockPostPaymentResp
                        })
                    ));
                });

            srvc.postPayment(mockPaymentTypeBody).subscribe(
                (data) => {
                    expect(data.payment_id).toBe(125);
                }
            );
        }))
    );


    it('it should create an observable with stripe token response',
        async(inject([PaymentService, MockBackend], (srvc, backend) => {

            let stripeObservable = srvc.createStripeToken('bankAccount', mockBank);
            expect(stripeObservable.catch).toBeDefined();

        }))
    );


});
