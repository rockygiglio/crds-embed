import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
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
export class ExistingPaymentInfoService {

    private baseUrl = 'https://gatewayint.crossroads.net:443/gateway/api/';
    private loginUrl = this.baseUrl + 'login';
    private getPreviousPmtUrl = this.baseUrl + 'donor/?email=';

    private testUserAcct = {
        username: 'scrudgemcduckcrds@mailinator.com',
        password: 'madmoneyyall'
    };


    constructor (private http: Http) {}

    getExistingPaymentInfoForUser(): Observable<any[]> {
        return this.http.post(this.loginUrl, this.testUserAcct)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getTestUser (): Observable<any[]> {
        return this.http.post(this.loginUrl, this.testUserAcct)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getExistingPaymentInfo (userToken: any): Observable<any[]> {

        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', `${userToken}`);


        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.getPreviousPmtUrl, options)
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
