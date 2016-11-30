import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';

import { ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ExistingPaymentInfoService } from './existing-payment-info.service';
import { HttpClientService } from './http-client.service';
import { CookieService } from 'angular2-cookie/core';


describe('Service: Existing Payment Info', () => {

  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ExistingPaymentInfoService,
        MockBackend,
        BaseRequestOptions,
        HttpClientService,
        CookieService,
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

  it('it should throw an HTTP error when email address is not found',
    async(inject([ExistingPaymentInfoService], (existingPaymentInfoService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('400 Error'));
        });

      existingPaymentInfoService.getExistingPaymentInfo().subscribe(
        (data) => {
          expect(data).toBe(null);
        });
    }))
  );

  it('it should fetch previous payment info as an object',
    async(inject([ExistingPaymentInfoService], (existingPaymentInfoService) => {

      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: {
                  'id': 0,
                  'Processor_ID': '000000',
                  'default_source': {
                    'credit_card': {
                      'last4': '1234',
                      'brand': 'visa',
                      'address_zip': '12345',
                      'exp_date': '01/16'
                    },
                    'bank_account': {
                      'routing': '123456789',
                      'last4': '0987',
                      'accountHolderName': 'Ricky Bobby',
                      'accountHolderType': 'individual'
                    }
                  },
                  'Registered_User': true,
                  'email': 'rickybobby@gmail.com'
                }
              }
            )));
        });

      existingPaymentInfoService.getExistingPaymentInfo().subscribe((data) => {

          // set this as a var to shorten it.
          let defaultSource = data.default_source;

          // validate that default source gets set
          expect(defaultSource).toBeDefined();

          // cc tests
          expect(defaultSource.credit_card.last4).toBe('1234');
          expect(defaultSource.credit_card.brand).toBe('visa');
          expect(defaultSource.credit_card.address_zip).toBe('12345');
          expect(defaultSource.credit_card.exp_date).toBe('01/16');

          // cc tests
          expect(defaultSource.bank_account.routing).toBe('123456789');
          expect(defaultSource.bank_account.last4).toBe('0987');
          expect(defaultSource.bank_account.accountHolderName).toBe('Ricky Bobby');
          expect(defaultSource.bank_account.accountHolderType).toBe('individual');
        });
    }))
  );

});
