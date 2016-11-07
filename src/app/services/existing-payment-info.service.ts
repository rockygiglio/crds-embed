import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ExistingPaymentInfoService {

  private baseUrl = process.env.CRDS_API_ENDPOINT + 'api/';
  private getPreviousPmtUrl = this.baseUrl + 'donor/?email=';
  private userPaymentInfo = null;

  constructor (private http: Http,
               private httpClientService: HttpClientService,
               private userSessionService: UserSessionService) {}

  resolve() {
    return this.getExistingPaymentInfo();
  }

  setUserPaymentInfo(userPaymentInfo) {
    this.userPaymentInfo = userPaymentInfo;
  }

  getUserPaymentInfo() {
    return this.userPaymentInfo;
  }

  getLastFourOfBankOrCcAcctNum() {

    let lastFour: any = null;

    if (this.userPaymentInfo && this.userPaymentInfo.length > 0) {
      lastFour = this.userPaymentInfo.default_source.credit_card.last4 ||
        this.userPaymentInfo.default_source.bank_account.last4;
    }

    return lastFour;
  };

  getExistingPaymentInfo(): Observable<any[]> {

    let requestOptions: any = this.httpClientService.getRequestOption();

    return this.http.get(this.getPreviousPmtUrl, requestOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    this.userPaymentInfo = body || { };

    console.log('Got previous pmt info for user: ');
    console.log(this.userPaymentInfo);

    return this.userPaymentInfo;
  }

  private handleError (res: Response | any) {
    this.userPaymentInfo = null;
    return [[]];
  }
}
