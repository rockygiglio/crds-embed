/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoginService } from './login.service';
import { HttpClientService } from './http-client.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { CrdsCookieService } from './crds-cookie.service';
import { CookieService } from 'angular2-cookie/core';

describe('Service: Login', () => {

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


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        HttpClientService,
        CrdsCookieService,
        CookieService,
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

  it('should create an instance', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

  it('should login a user', async(inject(
      [LoginService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.login('user@test.com', 'password');

      result.subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
    })));
});
