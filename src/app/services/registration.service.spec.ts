import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Response, HttpModule, Http, XHRBackend} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { RegistrationService } from './registration.service';
import { CrdsUser } from '../models/crds-user';


describe('Service: Registration', () => {

    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
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

    it('it should create new MP user',
        async(inject([RegistrationService], (registrationService) => {
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
                    console.log(data);
                    expect(data[0]).toBe(5);
                    expect(data[1]).toBe(20);
                    expect(data[2]).toBe(50);
                    expect(data[3]).toBe(100);
                    expect(data[4]).toBe(500);
                });
        }))
    );

});
