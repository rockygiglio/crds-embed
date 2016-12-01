import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GiftService } from './gift.service';
import { HttpClientService } from './http-client.service';
import { RecurringGiftDto } from '../models/recurring-gift-dto';
import { StripeService } from './stripe.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DonationService {

  private baseUrl: string = process.env.CRDS_API_ENDPOINT;

  constructor(private gift: GiftService,
              private http: HttpClientService,
              private stripe: StripeService) { }

  getTokenAndPostRecurringGift (pmtInfo: any, giftData: RecurringGiftDto){
    this.stripe.getCardInfoToken(this.gift.userCc).subscribe(
        token => {
          console.log('Got token from stripe');
          console.log(token);
          let tokenId: any = token['id'];
          giftData.stripe_token_id = tokenId;
          this.postRecurringGift(giftData).subscribe(
              succes => {
                console.log('Success!');
              }, err => {
                console.log('Err');
              }
          )
        }, err => {
          console.log('Failed to get token!');
        }
    )
  }

  postRecurringGift(giftData: RecurringGiftDto): Observable<any> {

    let recurringGiftUrl: string = this.baseUrl + 'api/donor/recurrence/';

    return this.http.post(recurringGiftUrl, giftData)
        .map(this.extractData)
        .catch(this.handleError);
  };

  private extractData(res: Response) {
    // console.log(res);
    return res;
  };

  private handleError (err: Response | any) {
    // console.log('Error');
    // console.log(err);
    return Observable.throw(err);
  };


}
