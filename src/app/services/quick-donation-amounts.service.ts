import { Injectable } from '@angular/core';
import { Http, Response, JsonpModule } from '@angular/http';
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
export class QuickDonationAmountsService implements Resolve<number[]> {

    constructor (private http: Http) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.getQuickDonationAmounts();
    }

    private baseUrl = 'http://localhost:49380/';

    private getQuickAmtsUrl = this.baseUrl + 'api/donations/predefinedamounts';

    private result: any;

    getQuickDonationAmounts (): Observable<number[]> {
        return this.http.get(this.getQuickAmtsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}