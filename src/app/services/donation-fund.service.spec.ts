/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DonationFundService } from './donation-fund.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { Program } from '../interfaces/program';

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

  it('should return default fund name when fund is not in list of funds',
    inject([DonationFundService], (srvc: DonationFundService) => {

      let fundId = 2;
      let fundName = srvc.getFundNameOrDefault(fundId, mockFunds, mockDefaultFund);
      expect(fundName).toBe(mockDefaultFund.Name);

  }));

  it('should return the name of the fund whose id was passed in',
    inject([DonationFundService], (srvc: DonationFundService) => {

      let fundId = 146;
      let fundName = srvc.getFundNameOrDefault(fundId, mockFunds, mockDefaultFund);
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
