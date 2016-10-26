import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {Headers, BaseRequestOptions, Response, HttpModule, Http, XHRBackend, RequestMethod} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {QuickDonationAmountsService} from './quick-donation-amounts.service.ts';


describe('Quick Donation Amounts Service', () => {

    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                QuickDonationAmountsService,
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

    it('it should get predefined donations amounts',
        async(inject([QuickDonationAmountsService], (quickDonationAmountsService) => {
            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                                body: [5, 20, 50, 100, 500]
                            }
                        )));
                });

            quickDonationAmountsService.getQuickDonationAmounts().subscribe(
                (data) => {
                    expect(data[0]).toBe(5);
                    expect(data[1]).toBe(20);
                    expect(data[2]).toBe(50);
                    expect(data[3]).toBe(100);
                    expect(data[4]).toBe(500);
                });
        }))
    );

});