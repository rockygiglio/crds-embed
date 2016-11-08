import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';
import { PaymentService } from './payment.service';
import { PreviousSummaryService } from './previous-summary.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DonationService implements Resolve<number> {

  constructor(private http: HttpClientService,
    private userSessionService: UserSessionService,
    private paymentService: PaymentService,
    private previousSummaryService: PreviousSummaryService) { }

  resolve() {
  }

  submitTransactionInfo(giveForm) {
    if (giveForm.accountForm.$valid) {
      paymentService.getDonor(email)
        .then(function (donor) {
          this.updateDonorAndDonate(donor.id);
        },

        function (error) {
          this.createDonorAndDonate();
        });
    } else {
      // TODO display general failure message on same page
      // $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
    }
  }

  updateDonorAndDonate(donorId) {
    // The vm.email below is only required for guest giver, however, there
    // is no harm in sending it for an authenticated user as well,
    // so we'll keep it simple and send it in all cases.
    if (GiveTransferService.view === 'cc') {
      this.createCard();
      paymentService.updateDonorWithCard(donorId, donationService.card, GiveTransferService.email)
        .then(function (donor) {
          donationService.donate(pgram, GiveTransferService.campaign);
        }, paymentService.stripeErrorHandler);
    } else if (GiveTransferService.view === 'bank') {
      donationService.createBank();
      paymentService.updateDonorWithBankAcct(donorId, donationService.bank, GiveTransferService.email)
        .then(function (donor) {
          donationService.donate(pgram, GiveTransferService.campaign);
        }, paymentService.stripeErrorHandler);
    }
    return donationService;
  }

  createDonorAndDonate() {
    if (GiveTransferService.view === 'cc') {
      this.createCard();
      paymentService.createDonorWithCard(donationService.card, GiveTransferService.email, GiveTransferService.donorFirstName, GiveTransferService.donorLastName)
        .then(function (donor) {
          this.donate();
        }, paymentService.stripeErrorHandler);
    } else if (GiveTransferService.view === 'bank') {
      donationService.createBank();
      paymentService.createDonorWithBankAcct(donationService.bank, GiveTransferService.email, GiveTransferService.donorFirstName, GiveTransferService.donorLastName)
        .then(function (donor) {
          donationService.donate(pgram, GiveTransferService.campaign);
        }, paymentService.stripeErrorHandler);
    }
  }

  createBank() {
    try {
// TODO get data from forms                      
      this.bank = {
        country: 'US',
        currency: 'USD',
        routing_number: 110000000,
        account_number: 000123456789,
        account_holder_name: 'Account Holder Name Here',
        account_holder_type: 'Personal'
      };
    } catch (err) {
      throw new Error('Unable to create bank account');
    }

  }

  createCard() {
    try {
// TODO get data from forms        
      this.card = {
        name: 'name here',
        number: 42424242424242 ,
        exp_month: 12,
        exp_year: 18,
        cvc: 123,
        address_zip: 45202
      };
    } catch (err) {
      throw new Error('Unable to create credit card');
    }
  }

  donate() {
    previousSummaryService.postPayment(amount, paymentType, transactionType, invoiceId);
  }

}
