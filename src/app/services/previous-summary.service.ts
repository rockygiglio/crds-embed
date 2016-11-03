import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SummaryService implements Resolve<number> {

    private transactionUrl = process.env.CRDS_API_ENDPOINT + 'api/donation/????';

    constructor (private http: HttpClientService,
                 private userSessionService: UserSessionService) {}

    resolve() {
         // return this.postPayment();
    }

  postPayment(invoiceId: string
               , contactId: number
               , amount: number
               , paymentTypeId: number
               , transactionType: string
             ): Observable<any> {
    let body = {
      'invoiceId': invoiceId,
      'contactId': contactId,
      'amount': amount,
      'paymentTypeId': paymentTypeId,  // cc or ach
      'transactionType': transactionType  // donation or payment
    };

    return this.http.post(this.transactionUrl, body)
      .catch(this.handleError);
  }

  private handleError (res: Response) {
        return [res.json()];
  }
}
