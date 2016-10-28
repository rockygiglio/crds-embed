import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Response, HttpModule, Http, XHRBackend} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {PreviousGiftAmountService} from './previous-gift-amount.service';


describe('Existing Payment Info Service', () => {

    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                PreviousGiftAmountService,
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

    it('it should provide a previous gift amount',
        async(inject([PreviousGiftAmountService], (previousGiftAmountService) => {
            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                                body: 40
                            }
                        )));
                });

            previousGiftAmountService.get().subscribe(
                (data) => {
                    expect(data).toBe(40);
                });
        }))
    );

});
