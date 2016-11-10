import { Component, Inject, OnInit } from '@angular/core';

import { StateManagerService } from '../services/state-manager.service';
import { Location } from '@angular/common';
import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private lastFourOfAcctNumber: any = null;

  constructor(private location: Location,
              private stateManagerService: StateManagerService,
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
    this.location.go(this.stateManagerService.getPrevPageToShow(this.stateManagerService.summaryIndex));
    return false;
  }

  next() {
    if (this.gift.url) {
      window.location.href = this.gift.url;
    } else {
      this.location.go(this.stateManagerService.getNextPageToShow(this.stateManagerService.summaryIndex));
    }
    return false;
  }

  isGuest() {
    return this.gift.isGuest;
  }

  changePayment() {
    this.gift.accountLast4 = null;
    this.location.go(this.stateManagerService.getPage(this.stateManagerService.billingIndex));
  }
}
