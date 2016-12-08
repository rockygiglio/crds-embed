import { Component, OnInit, OpaqueToken, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';
import { DonationService } from '../services/donation.service';
import { GiftFrequency } from '../models/gift-frequency';
import { StoreService } from '../services/store.service';
import { LoginService } from '../services/login.service';
import { PaymentService } from '../services/payment.service';
import { PaymentCallBody } from '../models/payment-call-body';
import { StateManagerService } from '../services/state-manager.service';

export const WindowToken = new OpaqueToken('Window');
export function _window(): Window {
  return window;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  private lastFourOfAcctNumber: any = null;
  private isSubmitInProgress: boolean = false;
  private redirectParams: Map<string, any> = new Map<string, any>();
  /* tslint:disable */
  private giftFrequency: GiftFrequency = new GiftFrequency('', ''); //used in html template only
  /* tslint:enable */

  constructor(private router: Router,
              private state: StateManagerService,
              private donationService: DonationService,
              private store: StoreService,
              private loginService: LoginService,
              private paymentService: PaymentService,
              @Inject(WindowToken) private window: Window) {}

  public ngOnInit() {
    this.lastFourOfAcctNumber = this.store.accountLast4 ? this.store.accountLast4 : this.getLastFourOfAccountNumber();
    this.store.validateRoute(this.router);
    this.state.setLoading(false);
    this.isSubmitInProgress = false;
  }

  /**
   * Submits the payment to gateway for processing. 
   * Stripe tokens created previously on billing
   * 
   * @method submitPayment
   * @return void
   */
  public submitPayment() {

    if (this.isSubmitInProgress) {
      return;
    }

    this.beginProcessing();

    let paymentType = this.store.paymentType === 'ach' ? 'bank' : 'cc';
    let paymentDetails = new PaymentCallBody(
      '',
      this.store.amount,
      paymentType, 'PAYMENT',
      this.store.invoiceId
    );

    // adding a new payment method (must use donor token to create saved payment method)
    if (this.store.isUsingNewPaymentMethod()) {
      this.paymentService.makeApiDonorCall(this.store.donor).subscribe(
          value => this.postTransaction(paymentDetails),
          error => this.handleOuterError()
      );

    // using an existing payment method (payment method already exists. auth token handles the payment)
    } else if (this.store.isUsingExistingPaymentMethod()) {
        this.postTransaction(paymentDetails);

    // somehow not having an existing method AND no donor created from new payment method
    } else {
      this.handleOuterError();
    }
  }

  /**
   * Submits the donation to gateway for processing. 
   * Stripe tokens created previously on billing
   * 
   * @method submitDonation
   * @return void
   */
  public submitDonation() {

    if (this.isSubmitInProgress) {
      return;
    }

    this.beginProcessing();

    // one time gifts
    if (this.store.isOneTimeGift()) {
      let paymentType = this.store.paymentType === 'ach' ? 'bank' : 'cc';
      let donationDetails = new PaymentCallBody(
        this.store.fund.ProgramId.toString(),
        this.store.amount,
        paymentType,
        'DONATION',
        this.store.invoiceId
      );

      // adding a new payment method (must use donor token to create saved payment method)
      if (this.store.isUsingNewPaymentMethod()) {
        this.paymentService.makeApiDonorCall(this.store.donor).subscribe(
            value => {
              if ( this.store.isGuest === true ) {
                donationDetails.donor_id = value.id;
                donationDetails.email_address = this.store.email;
              }
              this.postTransaction(donationDetails);
            },
            error => this.handleOuterError()
        );

      // using an existing payment method (payment method already exists. auth token handles the payment)
      } else if (this.store.isUsingExistingPaymentMethod()) {
        this.postTransaction(donationDetails);

      // somehow not having an existing method AND no donor created from new payment method
      } else {
        this.handleOuterError();
      }

    // recurring gifts
    } else if (this.store.isRecurringGift()) {

      // must use a new paymenth method (can't use existing)
      if (this.store.isUsingNewPaymentMethod()) {
        let userPaymentInfo: CustomerBank | CustomerCard  = this.store.userCc || this.store.userBank;
        let stripeMethodName: string = this.store.userCc ? 'getCardInfoToken' : 'getBankInfoToken';

        this.donationService.getTokenAndPostRecurringGift(userPaymentInfo, stripeMethodName).subscribe(
          success => this.handleSuccess(success),
          innerError => this.handleInnerError(innerError)
        );

      // error out if somehow existing payment info rings true (should never be the case)
      } else {
        this.handleOuterError();
      }

    // neither a one time gift or recurring. What is it?
    } else {
      this.handleOuterError();
    }
  }

  public back() {
    this.store.resetErrors();
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.summaryIndex));
    return false;
  }

  private next() {
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
    this.store.resetErrors();
    this.state.setLoading(true);
    this.isSubmitInProgress = true;
    this.state.watchState();
  }

  public postTransaction(details) {
    this.paymentService.postPayment(details).subscribe(
      success => this.handleSuccess(success),
      innerError => this.handleInnerError(innerError)
    );
  }

  private addParamsToRedirectUrl() {
    let delimiter = '?';
    this.redirectParams.forEach((value, key) => {
      this.store.url += `${delimiter}${key}=${value}`;
      delimiter = '&';
    });
  }

  private handleSuccess(info) {
    this.store.resetErrors();
    this.redirectParams.set('invoiceId', this.store.invoiceId);
    this.redirectParams.set('paymentId', info.payment_id);
    this.store.clearUserPmtInfo();
    this.next();
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
    this.loginService.logOut();
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

}
