import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';

import { ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { UserAuthenticationService } from './user-authentication.service';
import { HttpClientService } from './http-client.service';
import { CrdsCookieService } from './crds-cookie.service';
import { CookieService } from 'angular2-cookie/core';


describe('Service: User Authentication', () => {

  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        UserAuthenticationService,
        MockBackend,
        BaseRequestOptions,
        HttpClientService,
        CrdsCookieService,
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

  it('it should throw a 401 HTTP error when token does not work',
    async(inject([UserAuthenticationService], (userAuthenticationService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('401 Error'));
        });

      userAuthenticationService.login().subscribe(
        (data) => {
          expect(data).toBe(null);
        });
    }))
  );

  it('it should fetch previous payment info as an object',
    async(inject([UserAuthenticationService], (userAuthenticationService) => {

      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: {
                    'userToken': 'a;lkhjh234234ljmlskhjfopaslfnaRwlrjw.mdoflaihwensfod',
                    'userTokenExp': null,
                    'refreshToken': null,
                    'userId': 1,
                    'username': 'Ricky',
                    'userEmail': 'rickybobby@gmail.com',
                    'roles': [],
                    'age': 100,
                    'userPhone': '513123456'
                }
              }
            )));
        });

        userAuthenticationService.login().subscribe((data) => {

          expect(data).toBeDefined();
          expect(data.userToken).toBe('a;lkhjh234234ljmlskhjfopaslfnaRwlrjw.mdoflaihwensfod');

        });

    }))

  );

});
