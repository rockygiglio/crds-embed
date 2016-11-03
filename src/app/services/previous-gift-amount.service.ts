import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PreviousGiftAmountService implements Resolve<number> {

    private base = 'https://gatewayint.crossroads.net:443/gateway/api/';
    private url = this.base + 'donations';

    constructor (private http: HttpClientService,
                 private userSessionService: UserSessionService) {}

    resolve() {
         return this.get();
    }

    get(): Observable<string> {
        let pre = this.url;
        this.url = pre + '?limit=1';

        return this.http.get(this.url)
            .map(this.extract)
            .catch(this.error);
    }

    private extract(res: Response) {
        let body: any = res;
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