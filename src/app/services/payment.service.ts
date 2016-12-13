import { Injectable, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { Payment } from '../models/payment';
import { Donor } from '../models/donor';
import { RecurringDonor } from '../models/recurring-donor';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentService {

  private baseUrl = process.env.CRDS_API_ENDPOINT;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };
  public stripeMethods = {
    card: 'card',
    ach: 'bankAccount'
  };

  constructor(private http: Http,
    private httpClient: HttpClientService,
    private zone: NgZone) { }

  public getDonor(): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor';
    return this.httpClient.get(donorUrl)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public getDonorByEmail(email: string): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor?email=' + encodeURIComponent(email);
    return this.http.get(donorUrl)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public getQuickDonationAmounts(): Observable<number[]> {
    return this.http.get(this.baseUrl + 'api/donations/predefinedamounts')
      .map(this.extractData)
      .catch(this.defaultDonationAmounts);
  }

  private defaultDonationAmounts() {
    return [[5, 10, 25, 100, 500]];
  }

  public getRegisteredUser(email: string) {
    return this.http.get(this.baseUrl + 'api/lookup/0/find/?email=' + encodeURIComponent(email))
      .map(res => { return false; })
      .catch(res => { return [true]; });
  }

  public createOrUpdateDonor(donorInfo: Donor): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor';
    let requestOptions: any = this.httpClient.getRequestOption();

    if (donorInfo.rest_method === this.restVerbs.post) {
      return this.http.post(donorUrl, donorInfo, requestOptions)
        .map(this.extractData)
        .catch(this.handleError);
    } else if (donorInfo.rest_method === this.restVerbs.put) {
      return this.http.put(donorUrl, donorInfo, requestOptions)
        .map(this.extractData)
        .catch(this.handleError);
    }
  };

  public getStripeToken(method: string, body: CustomerBank | CustomerCard): Observable<any> {
    return new Observable(observer => {
      (<any>window).Stripe[method].createToken(body, (status, response) => {
        this.zone.run(() => {
          if (status === 200) {
            observer.next(response);
          } else {
            observer.error(new Error(response));
          }
        });
      });
    });
  }

  public postPayment(paymentInfo: Payment): Observable<any> {
    let url: string = this.baseUrl + 'api/donation';
    return this.httpClient.post(url, paymentInfo)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public postRecurringGift(recurringDonor: RecurringDonor): Observable<any> {
    let url: string = this.baseUrl + 'api/donor/recurrence/';
    return this.httpClient.post(url, recurringDonor)
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

  private handleError(err: Response | any) {
    return Observable.throw(err);
  };

}
