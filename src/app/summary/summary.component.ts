import { Component, Inject, OnInit } from '@angular/core';

import { GivingStore } from '../giving-state/giving.store';
import * as GivingActions from '../giving-state/giving.action-creators';
import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private lastFourOfAcctNumber: any = null;

  constructor(@Inject(GivingStore)
              private store: any,
              private gift: GiftService,
              private existingPaymentInfoService: ExistingPaymentInfoService) {}

  ngOnInit() {
    this.lastFourOfAcctNumber = this.gift.accountLast4 ? this.gift.accountLast4 : this.getLastFourOfAccountNumber();
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
    this.store.dispatch(GivingActions.render(this.gift.getPrevPageToShow(this.gift.summaryIndex)));
    return false;
  }

  next() {
    if (this.gift.url) {
      window.location.href = this.gift.url;
    } else {
      this.store.dispatch(GivingActions.render(this.gift.getNextPageToShow(this.gift.summaryIndex)));
    }
    return false;
  }

  isGuest() {
    return this.gift.isGuest;
  }

  changePayment() {
    this.gift.accountLast4 = null;
    this.store.dispatch(GivingActions.render(this.gift.paymentState[this.gift.billingIndex].path));
  }
}
