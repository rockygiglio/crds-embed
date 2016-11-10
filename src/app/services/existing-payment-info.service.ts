import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export interface PaymentInfo {
  id: number;
  Processor_ID: string;
  default_source: PaymentSource;
  Registered_User: boolean;
  email: string;
}

export interface PaymentSource {
  credit_card: CreditCardInfo;
  bank_account: BankAccountInfo;
}

export interface CreditCardInfo {
  last4: string;
  brand: string;
  address_zip: string;
  exp_date: string;
}

export interface BankAccountInfo {
  routing: string;
  last4: string;
  accountHolderName: string;
  accountHolderType: string;
}

@Injectable()
export class ExistingPaymentInfoService {

  private baseUrl = process.env.CRDS_API_ENDPOINT + 'api/';
  private getPreviousPmtUrl = this.baseUrl + 'donor/?email=';
  private userPaymentInfo = null;

  constructor(private http: HttpClientService) { }

  resolve() {
    if (this.userPaymentInfo) {
      return this.userPaymentInfo;
    } else {
      return this.getExistingPaymentInfo();
    }
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

  getExistingPaymentInfo(): Observable<any> {
    return this.http.get(this.getPreviousPmtUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res;
    this.userPaymentInfo = body || { };
    return this.userPaymentInfo;
  }

  private handleError (res: Response | any) {
    this.userPaymentInfo = null;
    return [[]];
  }
}
