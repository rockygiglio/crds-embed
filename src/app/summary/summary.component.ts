import { Component, OnInit } from '@angular/core';

import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';
import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { PaymentService } from '../services/payment.service';
import { PaymentCallBody } from '../models/payment-call-body';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private lastFourOfAcctNumber: any = null;

  constructor(private router: Router,
              private stateManagerService: StateManagerService,
              private gift: GiftService,
              private existingPaymentInfoService: ExistingPaymentInfoService,
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
    let paymentDetail = new PaymentCallBody(this.gift.amount, this.gift.paymentType, 'PAYMENT', this.gift.invoiceId );

    this.paymentService.postPayment(paymentDetail).subscribe(
      info => {
console.log('status in summary component: ' + info.status);
         if (this.isArrayOfLength(info, 0)) {
           this.gift.stripeException = true;
           this.changePayment();
          return false;
         }
         this.gift.stripeException = false;
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
      }
    );

    return false;
  }

  changePayment() {
    this.gift.resetExistingPaymentInfo();
    this.gift.resetPaymentDetails();
    this.router.navigateByUrl(this.stateManagerService.getPage(this.stateManagerService.billingIndex));
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
