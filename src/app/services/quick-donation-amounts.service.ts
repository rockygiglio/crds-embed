import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class QuickDonationAmountsService implements Resolve<number[]> {

    private getQuickAmtsUrl = process.env.EMBED_API_ENDPOINT + 'donations/predefinedamounts';

    constructor (private http: Http) {}

    resolve() {
        return this.getQuickDonationAmounts();
    }

    getQuickDonationAmounts (): Observable<number[]> {
        return this.http.get(this.getQuickAmtsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError () {
        return [[5, 10, 25, 100, 500]];
    }
}
