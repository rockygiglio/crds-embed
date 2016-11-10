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


  // TODO needs to be called after input cc or bank details
  // TODO - where do these .then success and failure calls go?  To this.paymentService.getDonor()

  submitTransactionInfo(giveForm) {

    let observable  = new Observable(observer => {

      this.paymentService.getDonor('sara.seissiger@ingagepartners.com'/*this.giftService.email*/)
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

      //this.createCard();
      this.card =  new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345); //test data
      this.paymentService.updateDonorWithCard(donorId, this.card, this.giftService.email)
        .then(function (donor) {
          this.donate();
        }, this.paymentService.stripeErrorHandler);

    } else if (this.giftService.paymentType === 'bank') {

      //this.createBank();
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

      //this.createCard();
      this.card =  new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345); //test data
      this.paymentService.createDonorWithCard(this.card, this.giftService.email, 'TODO donorFirstName', 'TODO donorLastName')
        .subscribe(
          result => {
            this.donate();
          },
          error => {

          }
        )

    } else if (this.giftService.paymentType === 'bank') {

      //this.createBank();
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

  // createBank() {
  //   try {
  //     this.bank = {
  //       country: 'US',
  //       currency: 'USD',
  //       routing_number: this.giftService.routingNumber,
  //       account_number: this.giftService.accountNumber,
  //       account_holder_name: this.giftService.accountName,
  //       account_holder_type: this.giftService.accountType
  //     };
  //   } catch (err) {
  //     throw new Error('Unable to create bank account');
  //   }
  //
  // }
  //
  // createCard() {
  //   try {
  //     this.card = {
  //       name: 'TODO Name for credit card',
  //       number: this.giftService.ccNumber,
  //       exp_month: this.giftService.expDate.substr(0, 2),
  //       exp_year: this.giftService.expDate.substr(2, 2),
  //       cvc: this.giftService.cvv,
  //       address_zip: this.giftService.zipCode
  //     };
  //   } catch (err) {
  //     throw new Error('Unable to create credit card');
  //   }
  // }

  // TODO needs to be called from summary submit button (Pay button)
  donate() {
    this.postPayment();
  }

// TODO need to reset/clear out sensitive data after process transaction
  postPayment(): Observable<any> {
    let body = {
      'amount': this.giftService.amount,
      'pymt_type': this.giftService.paymentType,  // bank or cc
      'transaction_type': 'PAYMENT',  // DONATION or PAYMENT
      'invoice_id': this.giftService.invoiceId,
    };

    return this.http.post(this.transactionUrl + 'api/donations', body) //exists, but won't do a pmt
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log('Call success');
    let body = res.json();
    return body;
  }

  private handleError (res: Response | any) {
    console.log('Call failure');
    return [[]];
  }

}
