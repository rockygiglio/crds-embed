import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';

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


    constructor (private http: Http,
                 private httpClientService: HttpClientService) {}

    resolve() {
        let userToken = 'someString';
        return this.getExistingPaymentInfo(userToken);
    }


    setUserPaymentInfo(userPaymentInfo) {
        this.userPaymentInfo = userPaymentInfo;
    }


    getUserPaymentInfo() {
        return this.userPaymentInfo;
    }


    getLastFourOfBankOrCcAcctNum() {

        let lastFour: any = null;

        let prevPmtDataIsEmptyArray: any = this.helperIsArrayOfLength(this.userPaymentInfo, 0);
        let isPrevPmtDataAvailable: any = this.userPaymentInfo && !prevPmtDataIsEmptyArray;

        if (isPrevPmtDataAvailable) {
            lastFour = this.userPaymentInfo.default_source.credit_card.last4 ||
                       this.userPaymentInfo.default_source.bank_account.last4;
        }

        return lastFour;
    };


    getExistingPaymentInfo (userToken: string): Observable<any[]> {

        let requestOptions: any = this.httpClientService.getRequestOption();

        return this.http.get(this.getPreviousPmtUrl, requestOptions)
                        .map(this.extractData)
                        .catch(this.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        this.userPaymentInfo = body || { };
        return body || { };
    }


    private handleError (res: Response | any) {
        this.userPaymentInfo = null;
        return [[]];
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
