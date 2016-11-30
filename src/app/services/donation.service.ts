import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { RecurringGiftDto } from '../models/recurring-gift-dto';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DonationService {

  private baseUrl: string = process.env.CRDS_API_ENDPOINT;

  constructor(private http: HttpClientService) { }

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
