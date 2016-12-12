import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { PaymentCallBody } from '../models/payment-call-body';
import { StripeService } from './stripe.service';
import { CrdsDonor } from '../models/crds-donor';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentService {

  public restMethodNames: any;
  private baseUrl = process.env.CRDS_API_ENDPOINT;

  constructor(private http: Http,
    private httpClient: HttpClientService,
    private stripeService: StripeService) {

    this.restMethodNames = {
      post: 'POST',
      put: 'PUT'
    };
  }

  getDonor(): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor';
    return this.httpClient.get(donorUrl)
      .map(this.extractData)
      .catch(this.handleError);
  };

  createDonorWithBankAcct(bankAcct: CustomerBank, email: string, firstName: string, lastName: string): Observable<any> {
    return this.createdDonorToken(bankAcct,
      email,
      firstName,
      lastName,
      this.stripeService.methodNames.bankAccount,
      this.restMethodNames.put);
  };

  createDonorWithCard(card: CustomerCard, email: string, firstName: string, lastName: string): Observable<any> {
    return this.createdDonorToken(card,
      email,
      firstName,
      lastName,
      this.stripeService.methodNames.card,
      this.restMethodNames.put);
  };

  updateDonorWithBankAcct(donorId: number, bankAcct: CustomerBank, email: string): Observable<any> {
    return this.createdDonorToken(bankAcct,
      email,
      null,
      null,
      this.stripeService.methodNames.bankAccount,
      this.restMethodNames.post);
  };

  updateDonorWithCard(donorId: number, card: CustomerCard, email: string): Observable<any> {
    return this.createdDonorToken(card,
      email,
      null,
      null,
      this.stripeService.methodNames.card,
      this.restMethodNames.post);
  };

  createdDonorToken(BankOrCcPmtInfo: CustomerBank | CustomerCard,
    email: string,
    firstName: string,
    lastName: string,
    stripeFunction: string,
    restMethod: string): Observable<any> {
    let observable = new Observable(observer => {
      this.stripeService[stripeFunction](BankOrCcPmtInfo).subscribe(
        stripeEncryptedPmtInfo => {
          observer.next(new CrdsDonor(stripeEncryptedPmtInfo.id, email, firstName, lastName, restMethod));
        },
        error => {
          observer.error(error);
        }
      );
    });
    return observable;
  };

  makeApiDonorCall(donorInfo: CrdsDonor): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor';
    let requestOptions: any = this.httpClient.getRequestOption();

    if (donorInfo.rest_method === this.restMethodNames.post) {
      return this.http.post(donorUrl, donorInfo, requestOptions)
        .map(this.extractData)
        .catch(this.handleError);
    } else if (donorInfo.rest_method === this.restMethodNames.put) {
      return this.http.put(donorUrl, donorInfo, requestOptions)
        .map(this.extractData)
        .catch(this.handleError);
    }
  };

  postPayment(paymentInfo: PaymentCallBody): Observable<any> {
    let url: string = this.baseUrl + 'api/donation';
    return this.httpClient.post(url, paymentInfo)
      .map(this.extractData)
      .catch(this.handleError);
  };

  private extractData(res: Response) {
    let body: any = res;
    if (typeof res.json === 'function') {
      body = res.json();
    }
    return body;
  };

  private handleError (err: Response | any) {
    return Observable.throw(err);
  };

}
