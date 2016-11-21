/* tslint:disable:no-unused-variable */

import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { DonationFundService } from './donation-fund.service';
import { MockBackend } from '@angular/http/testing';
import { Program } from '../interfaces/program';
import { TestBed, async, inject } from '@angular/core/testing';

describe('Service: DonationFund', () => {

    const mockDefaultFund: Program = {
    'ProgramId': 3,
    'Name': 'General Giving',
    'ProgramType': 1,
    'AllowRecurringGiving': true
  };

    const mockFunds: Array<Program> =
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
    inject([DonationFundService], (srvc: DonationFundService) => {

      let fundId = 2;
      let fundName = srvc.getUrlParamFundOrDefault(fundId, mockFunds, mockDefaultFund).Name;
      expect(fundName).toBe(mockDefaultFund.Name);

  }));

  it('should return the fund whose id was passed in',
    inject([DonationFundService], (srvc: DonationFundService) => {

      let fundId = 146;
      let fundName = srvc.getUrlParamFundOrDefault(fundId, mockFunds, mockDefaultFund).Name;
      expect(fundName).toBe('I\'m In');

  }));


  it('should create an instance', async(inject([DonationFundService, MockBackend], (service, mockBackend) => {
    expect(service).toBeDefined();
  })));

  it('should get funds', async(inject(
      [DonationFundService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockFunds) })));
      });

      const result = service.getFunds();

      result.subscribe(res => {
        expect(res).toEqual(mockFunds);
      });
    })));
});
