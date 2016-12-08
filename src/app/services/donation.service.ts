import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';
import { StoreService } from './store.service';
import { HttpClientService } from './http-client.service';
import { RecurringDonor } from '../models/recurring-donor';
import { StripeService } from './stripe.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DonationService {

  private baseUrl: string = process.env.CRDS_API_ENDPOINT;

  constructor(private gift: StoreService,
              private http: HttpClientService,
              private stripe: StripeService) { }

  getTokenAndPostRecurringGift (pmtInfo: CustomerBank | CustomerCard, stripeApiMethodName: string) {

    let recurrenceDate: string = this.gift.start_date.toISOString().slice(0, 10);

    let observable  = new Observable(observer => {

      this.stripe[stripeApiMethodName](pmtInfo).subscribe(
        token => {

          let giftDto: RecurringDonor = new RecurringDonor(
              token['id'],
              this.gift.amount,
              this.gift.fund.ProgramId.toString(),
              this.gift.frequency.value,
              recurrenceDate
          );

          this.postRecurringGift(giftDto).subscribe(
              recurringGiftResp => {
                observer.next(recurringGiftResp);
              }, err => {
                observer.error(new Error('Failed to post recurring gift'));
              }
          );
        }, err => {
          observer.error(new Error('Failed to get stripe token'));
        }
     );
    });

    return observable;

  }

  postRecurringGift(giftData: RecurringDonor): Observable<any> {

    let recurringGiftUrl: string = this.baseUrl + 'api/donor/recurrence/';

    return this.http.post(recurringGiftUrl, giftData)
        .map(this.extractData)
        .catch(this.handleError);
  };

  private extractData(res: Response) {
    return res;
  };

  private handleError (err: Response | any) {
    return Observable.throw(err);
  };


}
