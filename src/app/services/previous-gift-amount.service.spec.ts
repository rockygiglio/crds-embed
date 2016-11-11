import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';

import { ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PreviousGiftAmountService } from './previous-gift-amount.service';
import { HttpClientService } from './http-client.service';
import { CrdsCookieService } from './crds-cookie.service';
import { CookieService } from 'angular2-cookie/core';


describe('Previous Gift Amount Service', () => {

  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        PreviousGiftAmountService,
        MockBackend,
        HttpClientService,
        CrdsCookieService,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        },
        CookieService

      ],
      imports: [
        HttpModule
      ]
    });

    mockBackend = getTestBed().get(MockBackend);
    TestBed.compileComponents();
  }));


  it('it should provide the last amount when there are previous gifts',
    async(inject([PreviousGiftAmountService], (previousGiftAmountService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: {
                donations: [
                  {
                    amount: '4000'
                  }
                ]
              }
            }
            )));
        });

      previousGiftAmountService.get().subscribe(
        (data) => {
          expect(data).toBe('40.00');
        });
    }))
  );


  it('it should provide an amount of 0.00 when there are NO previous gift amounts',
    async(inject([PreviousGiftAmountService], (previousGiftAmountService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: {
                donations: []
              }
            }
            )));
        });

      previousGiftAmountService.get().subscribe(
        (data) => {
          expect(data).toBe('0.00');
        });
    }))
  );


  it('it should provide an amount of 0.00 when there there is an ERROR from MP',
    async(inject([PreviousGiftAmountService], (previousGiftAmountService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('Some error'));
        });

      previousGiftAmountService.get().subscribe(
        (data) => {
          expect(data).toBe('0.00');
        });
    }))
  );

});
