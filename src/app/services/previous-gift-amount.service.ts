import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PreviousGiftAmountService implements Resolve<number> {

    private url = process.env.CRDS_API_ENDPOINT + 'api/donations';
    private headers: Headers = new Headers();
    private token: string = '';

    constructor (private http: Http, private cookieService: CookieService) {
        this.token = this.cookieService.get('sessionId');
    }

    resolve() {
        return this.get();
    }

    get(): Observable<string> {

        let pre = this.url;
        this.url = pre + '?limit=1';
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', this.token);

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
        let amount: string;

        if ( body.donations !== undefined && body.donations[0] !== undefined ) {
            amount =  body.donations[0].amount.toString();
            amount = amount.substr(0, amount.length - 2) + '.' + amount.substr(amount.length - 2);
        } else {
            amount =  '0.00';
        }

        return amount;
    }

    private error (res: Response) {
        return ['0.00'];
    }
}
