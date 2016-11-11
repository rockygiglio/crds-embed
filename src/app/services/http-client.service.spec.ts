/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientService } from './http-client.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestOptions, Headers } from '@angular/http';
import { CrdsCookieService } from './crds-cookie.service';

describe('Service: HttpClient', () => {

  const mockResponse = {
    'userToken': 'AAEAAKVu0E-usertoken',
    'userTokenExp': '1800',
    'refreshToken': 'RF8l!IAAAACmMA6Di0_refreshtoken',
    'userId': 1234567,
    'username': 'testuser',
    'userEmail': 'user@test.com',
    'roles': [
      {
        'Id': 2,
        'Name': 'Administrators'
      },
      {
        'Id': 39,
        'Name': 'All Platform Users'
      },
      {
        'Id': 95,
        'Name': 'All Backend Users - CRDS'
      },
      {
        'Id': 1005,
        'Name': 'Batch Manager Administrators'
      }
    ],
    'age': 50,
    'userPhone': '123-456-7890'
  };

  class MockCrdsCookieService {
    public setAccessToken(value: string): void {};
    public setRefreshToken(value: string): void {};
    public getAccessToken() {
      return mockResponse.userToken;
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClientService,
        MockBackend,
        { provide: CrdsCookieService, useClass: MockCrdsCookieService},
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }]
    });
  });

  it('should create an instance', inject([HttpClientService], (service: HttpClientService) => {
    expect(service).toBeTruthy();
  }));

  it('should attach auth token to get request', inject(
    [HttpClientService, CrdsCookieService, MockBackend],
    (service, crdsCookieService, mockBackend) => {
      let url = 'api/url';

      spyOn(service.http, 'get').and.callThrough();
      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.get(url);
      let expectedReqOpts = new RequestOptions();
      let expectedHeaders = new Headers();
      expectedHeaders.set('Authorization', mockResponse.userToken);
      expectedHeaders.set('Content-Type', 'application/json');
      expectedHeaders.set('Accept', 'application/json, text/plain, */*');
      expectedReqOpts.headers = expectedHeaders;
      expect(service.http.get).toHaveBeenCalledWith(url, expectedReqOpts);
  }));

  it('should refresh auth tokens from response', async(inject(
    [HttpClientService, CrdsCookieService, MockBackend],
    (service, crdsCookieService, mockBackend) => {
      let url = 'api/url';

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.get(url);
      result.subscribe(res => {
        expect(service.crdsCookies.getAccessToken()).toBe(mockResponse.userToken);
      });
  })));

});
