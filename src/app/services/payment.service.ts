import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { Donor } from '../models/donor';
import { Fund } from '../models/fund';
import { Frequency } from '../models/frequency';
import { Payment } from '../models/payment';
import { RecurringDonor } from '../models/recurring-donor';
import { User } from '../models/user';

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
  public defaults = {
    authorized: null,
    donationsAmounts: Array(5, 10, 25, 100, 500),
    frequencies: Array(
      new Frequency('One Time', 'once', false),
      new Frequency('Weekly', 'week', true),
      new Frequency('Monthly', 'month', true)
    ),
    fund: new Fund(3, 'General Giving', 1, true),
    paymentInfo: null,
    previousGift: null
  };

  constructor(private http: Http, private session: SessionService, private zone: NgZone) { }

  // MP CALLS

  public createOrUpdateDonor(donorInfo: Donor): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor';
    let requestOptions: any = this.session.getRequestOption();
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

  public createStripeToken(method: string, body: CustomerBank | CustomerCard): Observable<any> {
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
  };

  public getAuthentication(): Observable<any> {
    return this.session.get(this.baseUrl + 'api/v1.0.0/authenticated')
      .map((res: Response) => {
        return res || this.defaults.authorized;
      })
      .catch((res: Response) => {
        return [this.defaults.authorized];
      });
  }

  public getDonor(): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor';
    return this.session.get(donorUrl)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public getDonorByEmail(email: string): Observable<any> {
    let donorUrl = this.baseUrl + 'api/donor?email=' + encodeURIComponent(email);
    return this.http.get(donorUrl)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public getExistingPaymentInfo(): Observable<any> {
    return this.session.get(this.baseUrl + 'api/donor?email=')
      .map(this.extractData)
      .catch(() => {
        return [this.defaults.paymentInfo];
      });
  }

  public getFrequencies(): Observable<any> {
    return new Observable(observer => {
      observer.next(this.defaults.frequencies);
    });
  }

  public getFunds(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/programs/1')
      .map((res) => {
        let body = res.json();
        let funds: Array<Fund> = new Array();
        if (Array.isArray(body) && body.length > 0) {
          for (let i = 0; i < body.length; i++) {
            if (this.isFundInArray(funds, body[i].ProgramId) === true) {
              break;
            }
            funds.push(
              new Fund(
                body[i].ProgramId,
                body[i].Name,
                body[i].ProgramType,
                body[i].AllowRecurringGiving
              )
            );
          }
        }
        return funds;
      })
      .catch(this.handleError);
  }

  public getFundByID(fundID: number, funds: Array<Fund>): Fund {
    let foundFund: any = funds.find(fund => Number(fund.ID) === Number(fundID));
    return foundFund ? foundFund : this.defaults.fund;
  }

  public getPreviousGiftAmount(): Observable<string> {
    let options = new RequestOptions({
      body: { limit: 1, includeRecurring: false }
    });
    return this.session.get(this.baseUrl + 'api/donations', options)
      .map((res) => {
        let amount: string;
        if ( res.donations !== undefined && Array.isArray(res.donations) && res.donations.length > 0 ) {
            let last = parseInt(res.donations.length, 10) - 1;
            if ( last < 0 ) {
                last = 0;
            }
            amount =  res.donations[last].amount.toString();
            amount = amount.substr(0, amount.length - 2) + '.' + amount.substr(amount.length - 2);
        }
        return amount;
      })
      .catch((error) => {
        return [this.defaults.previousGift];
      });
  };

  public getQuickDonationAmounts(): Observable<number[]> {
    return this.http.get(this.baseUrl + 'api/donations/predefinedamounts')
      .map(this.extractData)
      .catch((error) => {
        return [this.defaults.donationsAmounts];
      });
  }

  public getRegisteredUser(email: string): Observable<boolean> {
    return this.http.get(this.baseUrl + 'api/lookup/0/find/?email=' + encodeURIComponent(email))
      .map(res => { return false; })
      .catch(res => { return [true]; });
  };

  public postLogin(email: string, password: string): Observable<any> {
    let body = {
      'username': email,
      'password': password
    };
    return this.session.post(this.baseUrl + 'api/login', body)
      .map((res: Response) => {
        return res || this.defaults.authorized;
      })
      .catch(this.handleError);
  }

  public postPayment(paymentInfo: Payment): Observable<any> {
    let url: string = this.baseUrl + 'api/donation';
    return this.session.post(url, paymentInfo)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public postRecurringGift(recurringDonor: RecurringDonor): Observable<any> {
    let url: string = this.baseUrl + 'api/donor/recurrence/';
    return this.session.post(url, recurringDonor)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public postUser(user: User): Observable<any> {
    return this.session.post(this.baseUrl + 'api/user', user)
      .map(this.extractData)
      .catch(this.handleError);
  };

  // HELPER FUNCTIONS BELOW HERE

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

  private isFundInArray(funds, fundID) {
    for (let x = 0; x < funds.length; x++) {
      if (funds[x].ProgramId === fundID) {
        return true;
      }
    }
    return false;
  }

  public isLoggedIn(): boolean {
    return this.session.hasToken();
  }

  public logOut(): void {
    this.session.clearTokens();
    return;
  }

}
