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
  private paymentSubmitted: boolean = false;
  private redirectParams: Map<string, any> = new Map<string, any>();

  constructor(private router: Router,
              private stateManagerService: StateManagerService,
              private donationService: DonationService,
              private gift: GiftService,
              private loginService: LoginService,
              private paymentService: PaymentService,
              @Inject(WindowToken) private window: Window) {}

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
    this.gift.stripeException = false;
    this.gift.systemException = false;
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.summaryIndex));
    return false;
  }

  next() {
    if (this.gift.url) {
      this.addParamsToRedirectUrl();
      if (this.gift.overrideParent === true && this.window.top !== undefined) {
        this.window.top.location.href = this.gift.url;
      } else {
        this.window.location.href = this.gift.url;
      }
    } else {
      this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.summaryIndex));
    }
  }

  submitPayment() {
    this.gift.stripeException = false;
    this.gift.systemException = false;
    this.paymentSubmitted = true;

    let pymt_type = this.gift.paymentType === 'ach' ? 'bank' : 'cc';
    let paymentDetail = new PaymentCallBody('', this.gift.amount, pymt_type, 'PAYMENT', this.gift.invoiceId );

    this.paymentService.postPayment(paymentDetail).subscribe(
      info => {
         this.gift.stripeException = false;
         this.gift.systemException = false;
         this.redirectParams.set('invoiceId', this.gift.invoiceId);
         this.redirectParams.set('paymentId', info.payment_id);
         this.gift.clearUserPmtInfo();
         this.next();
      },
      error => {
        if (error.status === 400 || error.status === 500) {
          this.gift.systemException = true;
          return false;
        } else {
          this.gift.stripeException = true;
          this.changePayment();
          this.router.navigateByUrl('/billing');
          return false;
        }
      }
    );
    return false;
  }

  addParamsToRedirectUrl() {
    let delimiter = '?';
    this.redirectParams.forEach((value, key) => {
      this.gift.url += `${delimiter}${key}=${value}`;
      delimiter = '&';
    });
  }

  submitDonation() {
    if (this.gift.isOneTimeGift()) {
      let pymt_type = this.gift.paymentType === 'ach' ? 'bank' : 'cc';
      let donationDetails = new PaymentCallBody(this.gift.fund.ProgramId.toString(), this.gift.amount,
                                                pymt_type, 'DONATION', this.gift.invoiceId );

      this.paymentService.postPayment(donationDetails).subscribe(
          info => {
            this.gift.stripeException = false;
            this.gift.systemException = false;
            this.redirectParams.set('invoiceId', this.gift.invoiceId);
            this.redirectParams.set('paymentId', info.payment_id);
            this.gift.clearUserPmtInfo();
            this.next();
          },
          error => {
            if (error.status === 400 || error.status === 500) {
              this.gift.systemException = true;
              return false;
            } else {
              this.gift.stripeException = true;
              this.changePayment();
              this.router.navigateByUrl('/billing');
              return false;
            }
          }
      );
    } else { // Recurring Gift

      let userPmtInfo: CustomerBank | CustomerCard  = this.gift.userCc || this.gift.userBank;
      let stripeMethodName: string = this.gift.userCc ? 'getCardInfoToken' : 'getBankInfoToken';

      this.donationService.getTokenAndPostRecurringGift(userPmtInfo, stripeMethodName).subscribe(
          success => {
            this.gift.clearUserPmtInfo();
            this.next();
          }, error => {
            if (error.status === 400 || error.status === 500) {
              this.gift.systemException = true;
              return false;
            } else {
              this.gift.stripeException = true;
              this.changePayment();
              this.router.navigateByUrl('/billing');
              return false;
            }
          }
      );
    }
  }

  changePayment() {
    this.gift.resetExistingPaymentInfo();
    this.gift.resetPaymentDetails();
  }

  changeUser() {
    this.loginService.logOut();
    this.changePayment();
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
