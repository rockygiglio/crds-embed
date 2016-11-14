import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';
import { PaymentService } from './payment.service';
import { GiftService } from './gift.service';
import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DonationService implements Resolve<number> {

  private transactionUrl = process.env.CRDS_API_ENDPOINT;

  private bank: any;
  private card: any;

  constructor(private http: HttpClientService,
    private userSessionService: UserSessionService,
    private paymentService: PaymentService,
    private giftService: GiftService) { }


  submitTransactionInfo(giveForm) {

    let observable  = new Observable(observer => {

      this.paymentService.getDonor(this.giftService.email)
        .subscribe(
          donor => {
            this.updateDonorAndDonate(donor.id);
          },
          error => {
            this.createDonorAndDonate();
          }
        );

    });

    return observable;
  }

  updateDonorAndDonate(donorId) {

    if (this.giftService.paymentType === 'cc') {

      this.card =  new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345); //test data
      this.paymentService.updateDonorWithCard(donorId, this.card, this.giftService.email)
        .then(function (donor) {
          this.donate();
        }, this.paymentService.stripeErrorHandler);

    } else if (this.giftService.paymentType === 'bank') {

      this.card =  new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345); //test data+
      this.paymentService.updateDonorWithBankAcct(donorId, this.bank, this.giftService.email)
        .then(function (donor) {
          this.donate();
        }, this.paymentService.stripeErrorHandler);

    }
    return this;
  }

  createDonorAndDonate() {

    if (this.giftService.paymentType === 'cc') {

      //TODO: Donation test code - will be implemented during donatation flow work.
      this.card =  new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345);
      this.paymentService.createDonorWithCard(this.card, this.giftService.email, 'TODO donorFirstName', 'TODO donorLastName')
        .subscribe(
          result => {
            this.donate();
          },
          error => {

          }
        )

    } else if (this.giftService.paymentType === 'bank') {

      //TODO: Donation test code - will be implemented during donatation flow work.
      this.bank = CustomerBank = new CustomerBank('US', 'USD', 110000000, parseInt('000123456789', 10), 'Jane Austen', 'individual');
      this.paymentService.createDonorWithBankAcct(this.bank, this.giftService.email, 'TODO donorFirstName', 'TODO donorLastName')
        .subscribe(
          result => {
            this.donate();
          },
          error => {

          }
        )
    }
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError (res: Response | any) {
    return [[]];
  }

}
