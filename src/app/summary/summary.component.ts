import { Component, OnInit, OpaqueToken, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { Payment } from '../models/payment';

export const WindowToken = new OpaqueToken('Window');
export function _window(): Window {
  return window;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  private lastFourOfAcctNumber: any = null;
  private isSubmitInProgress: boolean = false;
  private redirectParams: Map<string, any> = new Map<string, any>();

  constructor(
    private router: Router,
    private state: StateService,
    private store: StoreService,
    private api: APIService,
    @Inject(WindowToken) private window: Window
  ) {}

  public ngOnInit() {
    this.lastFourOfAcctNumber = this.store.accountLast4 ? this.store.accountLast4 : this.getLastFourOfAccountNumber();
    this.store.validateRoute(this.router);
    this.state.setLoading(false);
    this.isSubmitInProgress = false;
  }

  public submitPayment() {
    if (this.isSubmitInProgress) {
      return;
    }
    this.beginProcessing();
    let paymentType = this.store.paymentType === 'ach' ? 'bank' : 'cc';
    let paymentDetails = new Payment(
      '',
      this.store.amount,
      paymentType, 'PAYMENT',
      this.store.invoiceId
    );
    if (this.store.isUsingNewPaymentMethod()) {
      this.api.createOrUpdateDonor(this.store.donor).subscribe(
          value => this.postTransaction(paymentDetails),
          error => this.handleOuterError()
      );
    } else if (this.store.isUsingExistingPaymentMethod()) {
        this.postTransaction(paymentDetails);
    } else {
      this.handleOuterError();
    }
  }

  public submitDonation() {
    if (this.isSubmitInProgress) {
      return;
    }
    this.beginProcessing();
    if (this.store.isOneTimeGift()) {
      let paymentType = this.store.paymentType === 'ach' ? 'bank' : 'cc';
      let donationDetails = new Payment(
        this.store.fund.ID.toString(),
        this.store.amount,
        paymentType,
        'DONATION',
        this.store.invoiceId
      );
      if (this.store.isUsingNewPaymentMethod()) {
        this.api.createOrUpdateDonor(this.store.donor).subscribe(
            donor => {
              if ( this.store.isGuest === true ) {
                donationDetails.donor_id = this.store.donor.donor_id;
                donationDetails.email_address = this.store.email;
              }
              this.postTransaction(donationDetails);
            },
            error => this.handleInnerError(error)
        );
      } else if (this.store.isUsingExistingPaymentMethod()) {
        this.postTransaction(donationDetails);
      } else {
        this.handleOuterError();
      }
    } else if (this.store.isRecurringGift()) {
      if (this.store.isUsingNewPaymentMethod()) {
        this.store.recurringDonor.predefined_amount  = this.store.isPredefined ? this.store.recurringDonor.amount : null;
        this.api.postRecurringGift(this.store.recurringDonor).subscribe(
          success => this.handleSuccess(success),
          error => this.handleInnerError(error)
        );

      } else {
        this.handleOuterError();
      }
    } else {
      this.handleOuterError();
    }
  }

  public back() {
    this.store.resetErrors();
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.summaryIndex));
    return false;
  }

  private adv() {
    if (this.store.url) {
      this.addParamsToRedirectUrl();
      if (this.store.overrideParent === true && this.window.top !== undefined) {
        this.window.top.location.href = this.store.url;
      } else {
        this.window.location.href = this.store.url;
      }
    } else {
      this.router.navigateByUrl(this.state.getNextPageToShow(this.state.summaryIndex));
    }
  }

  private beginProcessing() {
    this.state.setLoading(true);
    this.store.resetErrors();
    this.isSubmitInProgress = true;
  }

  public postTransaction(details: Payment) {
    details.predefined_amount = this.store.isPredefined ? details.amount : null;
    this.api.postPayment(details).subscribe(
      success => this.handleSuccess(success),
      error => this.handleInnerError(error)
    );
  }

  private addParamsToRedirectUrl() {
    let delimiter = '?';
    this.redirectParams.forEach((value, key) => {
      this.store.url += `${delimiter}${key}=${value}`;
      delimiter = '&';
    });
  }

  private setRedirectUrlParamsIfNecessary(paymentDetails) {
    if ( this.store.isPayment() ) {
      this.redirectParams.set('invoiceId', this.store.invoiceId);
      this.redirectParams.set('paymentId', paymentDetails.payment_id);
    }
  }

  private handleSuccess(info) {
    this.setRedirectUrlParamsIfNecessary(info);
    this.store.resetErrors();
    this.store.clearUserPmtInfo();
    this.adv();
  }

  private handleInnerError(error) {
    if (error.status === 400 || error.status === 500) {
      this.store.systemException = true;
      this.store.clearUserPmtInfo();
      this.isSubmitInProgress = false;
      this.state.setLoading(false);
    } else {
      this.store.stripeException = true;
      this.changePayment();
      this.router.navigateByUrl('/billing');
      this.isSubmitInProgress = false;
    }
  }

  private handleOuterError() {
    this.store.systemException = true;
    this.state.setLoading(false);
  }

  private changePayment() {
    this.store.resetExistingPmtInfo();
    this.store.resetPaymentDetails();
  }

  public changeUser() {
    this.api.logOut();
    this.changePayment();
  }

  private getLastFourOfAccountNumber() {
    try {
      let accountNumber = this.store.paymentType === 'cc' ? this.store.ccNumber.toString() : this.store.accountNumber.toString();
      return accountNumber.substr(accountNumber.length - 4);
    } catch (event) {
      return undefined;
    }
  }

  public hideBack() {
    if ( this.store.isPayment() && this.store.accountLast4 && this.store.amountLocked) {
      return true;
    } else {
      return false;
    }
  }

}
