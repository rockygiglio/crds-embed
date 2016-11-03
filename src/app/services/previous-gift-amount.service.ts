import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PreviousGiftAmountService implements Resolve<number> {

    private url = process.env.CRDS_API_ENDPOINT + 'api/donations';

    constructor (private http: HttpClientService,
                 private userSessionService: UserSessionService) {}

    resolve() {
         return this.get();
    }

    get(): Observable<string> {
        let options = new RequestOptions({
            body: { limit: 1, includeRecurring: false }
        });

        return this.http.get(this.url, options)
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
