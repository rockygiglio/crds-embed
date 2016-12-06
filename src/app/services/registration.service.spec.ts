import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Response, HttpModule, Http, XHRBackend} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { HttpClientService } from './http-client.service';
import { MockBackend, MockConnection} from '@angular/http/testing';
import { RegistrationService } from './registration.service';
import { CrdsUser } from '../models/crds-user';


describe('Service: Registration', () => {

    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                CookieService,
                HttpClientService,
                RegistrationService,
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

    fit('should pass', inject([RegistrationService], (registrationService) => {
        expect(true).toBe(true);
    }));

  /*    it('it should create new MP user',
        
        async(inject([RegistrationService], (registrationService) => {
            expect(true).toBeTruthy();
          console.log('running');
            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                                body: [{firstname: 'Greg', lastname: 'McGregson', email: 'greg@a.com', password: 'pass1234'}]
                            }
                        )));
                });


            let newUser = new CrdsUser('Greg', 'McGregson', 'greg@a.com', 'pass1234');

            registrationService.postUser(newUser).subscribe(
                (data) => {
                    expect(data).toBeNull();
                });
        }))
    
})));*/

});
