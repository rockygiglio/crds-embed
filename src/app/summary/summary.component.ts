import { Component, OnInit, OpaqueToken, Inject } from '@angular/core';
import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';
import { DonationService } from '../services/donation.service';
import { GiftService } from '../services/gift.service';
import { LoginService } from '../services/login.service';
import { PaymentService } from '../services/payment.service';
import { PaymentCallBody } from '../models/payment-call-body';

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

  constructor(private router: Router,
              private state: StateManagerService,
              private donationService: DonationService,
              private gift: GiftService,
              private loginService: LoginService,
              private paymentService: PaymentService,
              @Inject(WindowToken) private window: Window) {}

  public ngOnInit() {
    this.lastFourOfAcctNumber = this.gift.accountLast4 ? this.gift.accountLast4 : this.getLastFourOfAccountNumber();
    this.gift.validateRoute(this.router);
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

    let paymentType = this.gift.paymentType === 'ach' ? 'bank' : 'cc';
    let paymentDetails = new PaymentCallBody(
      '',
      this.gift.amount,
      paymentType, 'PAYMENT',
      this.gift.invoiceId
    );

    // adding a new payment method (must use donor token to create saved payment method)
    if (this.gift.isUsingNewPaymentMethod()) {
      this.paymentService.makeApiDonorCall(this.gift.donor).subscribe(
          value => this.postTransaction(paymentDetails),
          error => this.handleOuterError()
      );

    // using an existing payment method (payment method already exists. auth token handles the payment)
    } else if (this.gift.isUsingExistingPaymentMethod()) {
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
    if (this.gift.isOneTimeGift()) {
      let paymentType = this.gift.paymentType === 'ach' ? 'bank' : 'cc';
      let donationDetails = new PaymentCallBody(
        this.gift.fund.ProgramId.toString(),
        this.gift.amount,
        paymentType,
        'DONATION',
        this.gift.invoiceId
      );

      // adding a new payment method (must use donor token to create saved payment method)
      if (this.gift.isUsingNewPaymentMethod()) {
        this.paymentService.makeApiDonorCall(this.gift.donor).subscribe(
            value => {
              if ( this.gift.isGuest === true ) {
                donationDetails.donor_id = value.id;
                donationDetails.email_address = this.gift.email;
              }
              this.postTransaction(donationDetails);
            },
            error => this.handleOuterError()
        );

      // using an existing payment method (payment method already exists. auth token handles the payment)
      } else if (this.gift.isUsingExistingPaymentMethod()) {
        this.postTransaction(donationDetails);

      // somehow not having an existing method AND no donor created from new payment method
      } else {
        this.handleOuterError();
      }

    // recurring gifts
    } else if (this.gift.isRecurringGift()) {

      // must use a new paymenth method (can't use existing)
      if (this.gift.isUsingNewPaymentMethod()) {
        let userPaymentInfo: CustomerBank | CustomerCard  = this.gift.userCc || this.gift.userBank;
        let stripeMethodName: string = this.gift.userCc ? 'getCardInfoToken' : 'getBankInfoToken';

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
    this.gift.resetErrors();
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.summaryIndex));
    return false;
  }

  private next() {
    if (this.gift.url) {
      this.addParamsToRedirectUrl();
      if (this.gift.overrideParent === true && this.window.top !== undefined) {
        this.window.top.location.href = this.gift.url;
      } else {
        this.window.location.href = this.gift.url;
      }
    } else {
      this.router.navigateByUrl(this.state.getNextPageToShow(this.state.summaryIndex));
    }
  }

  private beginProcessing() {
    this.gift.resetErrors();
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
      this.gift.url += `${delimiter}${key}=${value}`;
      delimiter = '&';
    });
  }

  private handleSuccess(info) {
    this.gift.resetErrors();
    this.redirectParams.set('invoiceId', this.gift.invoiceId);
    this.redirectParams.set('paymentId', info.payment_id);
    this.gift.clearUserPmtInfo();
    this.next();
  }

  private handleInnerError(error) {
    if (error.status === 400 || error.status === 500) {
      this.gift.systemException = true;
      this.gift.clearUserPmtInfo();
      this.isSubmitInProgress = false;
      this.state.setLoading(false);
    } else {
      this.gift.stripeException = true;
      this.changePayment();
      this.router.navigateByUrl('/billing');
      this.isSubmitInProgress = false;
    }
  }

  private handleOuterError() {
    this.gift.systemException = true;
    this.state.setLoading(false);
  }

  private changePayment() {
    this.gift.resetExistingPaymentInfo();
    this.gift.resetPaymentDetails();
  }

  public changeUser() {
    this.loginService.logOut();
    this.changePayment();
  }

  private getLastFourOfAccountNumber() {
    try {
      let accountNumber = this.gift.paymentType === 'cc' ? this.gift.ccNumber.toString() : this.gift.accountNumber.toString();
      return accountNumber.substr(accountNumber.length - 4);
    } catch (event) {
      return undefined;
    }
  }

}
