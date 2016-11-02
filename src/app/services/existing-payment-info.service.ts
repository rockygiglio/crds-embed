import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ExistingPaymentInfoService {

    private baseUrl = 'https://gatewayint.crossroads.net:443/gateway/api/';
    private loginUrl = this.baseUrl + 'login';
    private getPreviousPmtUrl = this.baseUrl + 'donor/?email=';
    private userPaymentInfo = null;

    private testUserAcct = {
        username: 'scrudgemcduckcrds@mailinator.com',
        password: 'madmoneyyall'
    };


    constructor (private http: Http) {}


    setUserPaymentInfo(userPaymentInfo) {
        this.userPaymentInfo = userPaymentInfo;
    }


    getUserPaymentInfo() {
        return this.userPaymentInfo;
    }


    getLastFourOfBankOrCcAcctNum() {
        console.log('Getting last 4 in service:');

        let lastFour: any = null;

        let prevPmtDataIsEmptyArray = this.helperIsArrayOfLength(this.userPaymentInfo, 0);
        let isPrevPmtDataAvailable = this.userPaymentInfo && !prevPmtDataIsEmptyArray;

        console.log('Is previous data available? ' + isPrevPmtDataAvailable);
        console.log(this.userPaymentInfo);
        console.log([]);

        if (isPrevPmtDataAvailable) {
            console.log('User pmt info exists:');
            console.log(this.userPaymentInfo);
            console.log('CC last 4');
            console.log(this.userPaymentInfo.default_source.credit_card.last4);
            console.log('Bank last 4');
            console.log(this.userPaymentInfo.default_source.bank_account.last4);
            lastFour = this.userPaymentInfo.default_source.credit_card.last4 ||
                       this.userPaymentInfo.default_source.bank_account.last4;
        }

        console.log('Final last 4 returned from service');
        console.log(lastFour);
        return lastFour;
    };


    getTestUser (): Observable<any[]> {
        return this.http.post(this.loginUrl, this.testUserAcct)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getExistingPaymentInfo (userToken: string): Observable<any[]> {

        let requestOptions = this.getRequestOptionsWithTokenInHeader(userToken);

        return this.http.get(this.getPreviousPmtUrl, requestOptions)
                        .map(this.extractData)
                        .catch(this.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }


    private handleError (res: Response | any) {
        return [[]];
    }


    getRequestOptionsWithTokenInHeader(userToken: string) {
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', `${userToken}`);

        let options = new RequestOptions({ headers: headers });

        return options;
    }

    helperIsArrayOfLength(obj, length) {
        let isArrayOfSpecifiedLength = false;

        if(Array.isArray(obj)){
            if(obj.length === length){
                isArrayOfSpecifiedLength = true;
            }
        }

        return isArrayOfSpecifiedLength;
    }
}
