import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PreviousGiftAmountService implements Resolve<number> {

    private base = 'https://gatewayint.crossroads.net:443/gateway/api/';
    private url = this.base + 'donations';
    private headers: Headers = new Headers();
    private token: string = '';

    constructor (private http: Http) {

        // add code to set token value
        // this.token = $cookie.get('sessionId');

    }

    resolve() {
        return this.get();
    }

    get (): Observable<number> {

        let params = {
            limit : 1,
            softcredit: false,
            impersonateDonorId: '',
            includeRecurring: false,
            Authorization: this.token
        };

        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Parameter', JSON.stringify(params));

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: this.url,
            headers: this.headers
        });

        return this.http.request(new Request(options))
            .map(this.extract)
            .catch(this.error);
    }

    private extract(res: Response) {
        let body = res.json();
        return body || 40;
    }

    private error (fallback: number) {
        return [40];
    }
}
