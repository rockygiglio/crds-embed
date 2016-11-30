import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { ExistingPaymentInfoService } from './existing-payment-info.service';
import { GiftService } from './gift.service';
import { HttpClientService } from './http-client.service';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import { ParamValidationService } from './param-validation.service';
import { PaymentCallBody} from '../models/payment-call-body';
import { PaymentService } from './payment.service';
import { StateManagerService } from './state-manager.service';
import { StripeService } from './stripe.service';

class MockActivatedRoute {
    public snapshot = {
        queryParams: []
    };
}


class MockStripeService {

    public methodNames = {
        card: 'getCardInfoToken',
        bankAccount: 'getBankInfoToken'
    };

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

    let mockCrdsDonor = '{"stripe_token": 123,"email_address":"test@test.com","first_name":"John","last_name":"Doe"}';
    let mockBank =  new CustomerBank('US', 'USD', 110000000, parseInt('000123456789', 10), 'Jane Austen', 'individual');
    let mockPaymentTypeBody = new PaymentCallBody('', 1, 'bank', 'PAYMENT', 123);
    let mockPostPaymentResp = '{"amount":1,"email":"scrudgemcduckcrds@mailinator.com","status":0,"include_on_giving_h'
    + 'istory":false,"include_on_printed_statement":false,"date":"0001-01-01T00:00:00","fee":0.0,"payment_id":125,"'
    + 'source":{"type":0},"distributions":[]}';
    let mockDonorResp =  `{
      "id": 1,
      "Processor_ID": "string",
      "default_source": {
        "credit_card": {
          "last4": "string",
          "brand": "string",
          "address_zip": "string",
          "exp_date": "string"
        },
        "bank_account": {
          "routing": "string",
          "last4": "0987",
          "accountHolderName": "string",
          "accountHolderType": "string"
        }
      },
      "Registered_User": true,
      "email": "string"
    }`;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                ExistingPaymentInfoService,
                LoginService,
                MockBackend,
                HttpClientService,
                BaseRequestOptions,
                ParamValidationService,
                PaymentService,
                StateManagerService,
                GiftService,
                { provide: StripeService, useClass: MockStripeService},
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
        async(inject([PaymentService, MockBackend], (srvc) => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockCrdsDonor
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
        async(inject([PaymentService, MockBackend], (srvc) => {

            mockBackend.connections.subscribe(
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
        async(inject([PaymentService, MockBackend], (srvc) => {

            mockBackend.connections.subscribe(
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


    it('it should post a new donor with a bank account',
        async(inject([PaymentService, MockBackend], (srvc) => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockDonorResp
                        })
                    ));
                });

            srvc.createDonorWithBankAcct(mockBank, 'test@test.com', 'John', 'Doe').subscribe(
                (data) => {
                    expect(JSON.parse(data._body).default_source.bank_account.last4).toBe('0987');
                }
            );
        }))
    );


});
