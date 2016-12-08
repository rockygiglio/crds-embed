
import { CookieService } from 'angular2-cookie/core';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { StoreService } from './store.service';
import { HttpClientService } from './http-client.service';
import { PreviousGiftAmountService } from './previous-gift-amount.service';

describe('Service: Previous Gift Amount', () => {

  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        PreviousGiftAmountService,
        MockBackend,
        HttpClientService,
        BaseRequestOptions,
        StoreService,
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


  it('it should provide the last amount in the array when there are previous gifts',
    async(inject([PreviousGiftAmountService], (previousGiftAmountService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: {
                donations: [
                  {
                    amount: '4000'
                  },
                  {
                    amount: '5000'
                  }
                ]
              }
            }
            )));
        });

      previousGiftAmountService.get().subscribe(
        (data) => {
          expect(data).toBe('50.00');
        });
    }))
  );


  it('it should expect a null response when there are NO previous gift amounts',
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
          expect(data).toBe(null);
        });
    }))
  );


  it('it should expect a null response when there there is an ERROR from MP',
    async(inject([PreviousGiftAmountService], (previousGiftAmountService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('Some error'));
        });

      previousGiftAmountService.get().subscribe(
        (data) => {
          expect(data).toBe(null);
        });
    }))
  );

});
