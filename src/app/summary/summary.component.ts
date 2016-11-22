import { Component, OnInit } from '@angular/core';

import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';
import { GiftService } from '../services/gift.service';
import { PaymentService } from '../services/payment.service';
import { PaymentCallBody } from '../models/payment-call-body';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private lastFourOfAcctNumber: any = null;
  private paymentSubmitted: boolean = false;

  constructor(private router: Router,
              private stateManagerService: StateManagerService,
              private gift: GiftService,
              private paymentService: PaymentService) {}

  ngOnInit() {
    this.lastFourOfAcctNumber = this.gift.accountLast4 ? this.gift.accountLast4 : this.getLastFourOfAccountNumber();

    if (!this.gift.type) {
      this.router.navigateByUrl('/payment');
    }

    this.stateManagerService.is_loading = false;
  }

  getLastFourOfAccountNumber() {
    try {
      let accountNumber = this.gift.paymentType === 'cc' ? this.gift.ccNumber.toString() : this.gift.accountNumber.toString();
      return accountNumber.substr(accountNumber.length - 4);
    } catch (event) {
      return undefined;
    }
  }

  back() {
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.summaryIndex));
    return false;
  }

  next() {
    this.paymentSubmitted = true;
    let pymt_type = this.gift.paymentType === 'ach' ? 'bank' : 'cc';
    let paymentDetail = new PaymentCallBody(this.gift.amount, pymt_type, 'PAYMENT', this.gift.invoiceId );

    this.paymentService.postPayment(paymentDetail).subscribe(
      info => {
         this.gift.stripeException = false;
         this.gift.systemException = false;
         if (this.gift.url) {
           this.gift.url = this.gift.url + '?invoiceId=' + this.gift.invoiceId + '&paymentId='  + info.payment_id;
           if (this.gift.overrideParent === true && window.top !== undefined ) {
             window.top.location.href = this.gift.url;
           } else {
             window.location.href = this.gift.url;
           }
         } else {
           this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.summaryIndex));
         }
      },
      error => {
        if (error.status === 400) {
          this.gift.systemException = true;
          return false;
        } else {
          this.gift.stripeException = true;
          this.changePayment();
          return false;
        }
      }
    );

    return false;
  }

  changePayment() {
    this.gift.resetExistingPaymentInfo();
    this.gift.resetPaymentDetails();
  }

  isArrayOfLength(obj: any, length: number) {
    let isArrayOfSpecifiedLength = false;

    if (Array.isArray(obj)) {
      if (obj.length === length) {
        isArrayOfSpecifiedLength = true;
      }
    }
    return isArrayOfSpecifiedLength;
  }

  isGuest() {
    return this.gift.isGuest;
  }

}
