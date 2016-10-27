/* tslint:disable:max-line-length */
import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Response, HttpModule, Http, XHRBackend} from '@angular/http';
import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import { CheckGuestEmailService } from './check-guest-email.service';

describe('CheckGuestEmailService', () => {

  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckGuestEmailService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ],
      imports: [
        HttpModule
      ]
    });

    mockBackend = getTestBed().get(MockBackend);
    TestBed.compileComponents();
  }));

  it("returns false when guest email does not exist",
    async(inject([CheckGuestEmailService], (checkGuestEmailService) => {
      mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: false
          }
        )));
      });

      checkGuestEmailService.guestEmailExists('foo@blaziksmnahg.com').subscribe(
      (data) => {
        console.log(data);
        expect(data).toBe(false);
      });
    }))
  );

  it("returns true when guest email does exist",
    async(inject([CheckGuestEmailService], (checkGuestEmailService) => {
      mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: true
          }
        )));
      });

      checkGuestEmailService.guestEmailExists('good@example.com').subscribe(
      (data) => {
        console.log(data);
        expect(data).toBe(true);
      });
    }))
  );

});
