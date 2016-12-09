/* tslint:disable:no-unused-variable */

import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { DonationFundService } from './donation-fund.service';
import { MockBackend } from '@angular/http/testing';
import { Fund } from '../models/fund';
import { TestBed, async, inject } from '@angular/core/testing';

describe('Service: DonationFund', () => {

    const mockDefaultFund: Fund = new Fund(3, 'General Giving', 1, true);
    const mockFunds: Array<any> =
    [
      {
        'ProgramId': 3,
        'Name': 'General Giving',
        'ProgramType': 1,
        'AllowRecurringGiving': true
      },
      {
        'ProgramId': 146,
        'Name': 'I\'m In',
        'ProgramType': 1,
        'AllowRecurringGiving': true
      },
      {
        'ProgramId': 313,
        'Name': '(t) Test Pledge Program1',
        'ProgramType': 1,
        'AllowRecurringGiving': false
      },
      {
        'ProgramId': 314,
        'Name': '(t) Test Pledge Program2',
        'ProgramType': 1,
        'AllowRecurringGiving': true
      }
    ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DonationFundService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should return the default fund when fund is not in list of funds',
    inject([DonationFundService, MockBackend], (service: DonationFundService, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockFunds) })));
      });
      service.getFunds().subscribe(funds =>  {
        let fundId = 2;
        let fundName = service.getUrlParamFundOrDefault(fundId, funds, mockDefaultFund).Name;
        expect(fundName).toBe(mockDefaultFund.Name);
      });

  }));

  it('should return the fund whose id was passed in',
    inject([DonationFundService, MockBackend], (service: DonationFundService, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockFunds) })));
      });
      service.getFunds().subscribe(funds =>  {
        let fundId = 146;
        let fundName = service.getUrlParamFundOrDefault(fundId, funds, mockDefaultFund).Name;
        expect(fundName).toBe('I\'m In');
      });

  }));


  it('should create an instance', async(inject([DonationFundService, MockBackend], (service, mockBackend) => {
    expect(service).toBeDefined();
  })));

  it('should get funds', async(inject(
      [DonationFundService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockFunds) })));
      });

      let result = service.getFunds();
      result.subscribe(res => {
        expect(res[0].ID).toEqual(mockFunds[0].ProgramId);
      });
    })));
});
