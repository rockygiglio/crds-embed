import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ExistingPaymentInfoService /*implements Resolve<number[]>*/ {

    private baseUrl = 'https://gatewayint.crossroads.net:443/gateway/api/';
    private getQuickAmtsUrl = this.baseUrl + 'donations/predefinedamounts';

    constructor (private http: Http) {}

    // resolve(route: ActivatedRouteSnapshot) {
    //     return this.getQuickDonationAmounts();
    // }

    getExistingPaymentInfo (): Observable<any[]> {
        return this.http.get(this.getQuickAmtsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (res: Response | any) {
        return [[5, 10, 25, 100, 500]];
    }
}
