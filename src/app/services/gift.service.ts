import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';
import { ExistingPaymentInfoService, PaymentInfo } from './existing-payment-info.service';
import { LoginService } from './login.service';
import { ParamValidationService } from './param-validation.service';
import { Program } from '../interfaces/program';
import { StateManagerService } from './state-manager.service';
import { CrdsDonor } from '../models/crds-donor';

declare var _;

@Injectable()
export class GiftService {

  public errors: Array<string> = [];
  public fundId: number = 0;
  public invoiceId: number = 0;
  public isInitialized: boolean = false;
  public minPayment: number = 0;
  public overrideParent: boolean = true;
  public stripeException: boolean = false;
  public title: string = '';
  public totalCost: number = 0;
  public type: string = '';
  public url: string = '';
  public systemException: boolean = false;

  private queryParams: Object;

  // Form options
  public predefinedAmounts: number[];
  public existingPaymentInfo: Observable<any>;
  public paymentMethod: string = 'Bank Account';

  // Payment Information
  public accountLast4: string = '';
  public amount: number;
  public selectedAmount: number;
  public customAmount: number;
  public paymentType: string = '';

  // user info
  public email: string = '';
  public isGuest: boolean = false;
  public previousGiftAmount: string = '';
  public donor: CrdsDonor;

  // ACH Information
  public accountName: string;
  public accountNumber: string;
  public accountType: string = 'individual';
  public routingNumber: string;

  // Credit Card information
  public ccNumber: string = '';
  public cvv: string = '';
  public expDate: string = '';
  public zipCode: string = '';

  // Fund and frequency information
  public fund: Program = undefined;
  public start_date: any = '';
  public frequency: any = '';

  public userBank: CustomerBank = undefined;
  public userCc: CustomerCard  = undefined;

  constructor(private existingPaymentInfoService: ExistingPaymentInfoService,
              private helper: ParamValidationService,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private state: StateManagerService) {
    this.processQueryParams();
    this.preloadData();
    this.isInitialized = true;
  }

  public clearUserPmtInfo() {
    this.userBank = undefined;
    this.userCc = undefined;
  }

  public loadExistingPaymentData(): void {
    if ( !this.isOneTimeGift() ) {
      return;
    }
    this.existingPaymentInfo = this.existingPaymentInfoService.getExistingPaymentInfo();
    this.existingPaymentInfo.subscribe(
        info => {
          if ( info !== null ) {
            this.setBillingInfo(info);
            if (this.accountLast4) {
              this.state.hidePage(this.state.billingIndex);
            }
          }
        }
    );
  }

  public loadUserData(): void {
    this.loadExistingPaymentData();
    this.loginService.authenticate().subscribe(
      (info) => {
        if ( info !== null ) {
          this.email = info.userEmail;
        } else {
          this.loginService.logOut();
        }
      }
    );
  }

  public preloadData(): void {
    if (this.loginService.isLoggedIn()) {
      this.state.hidePage(this.state.authenticationIndex);
      this.loadUserData();
    }
  }

  public resetExistingPaymentInfo(): void {
    this.state.unhidePage(this.state.billingIndex);
    this.accountLast4 = null;

    let emptyPaymentInfo: any = {
      default_source: {
        credit_card: { last4: null},
        bank_account: { last4: null}
      }
    };
    this.existingPaymentInfo = Observable.of(emptyPaymentInfo);
  };

  public validAmount() {
    let result = false;
    if (this.isPayment()) {
      result = !isNaN(this.amount)
        && this.validDollarAmount(this.amount)
        && Number(this.amount) >= this.minPayment
        && Number(this.amount) <= this.totalCost;
    } else if (this.isDonation()) {
      result = !isNaN(this.amount)
        && this.validDollarAmount(this.amount)
        && Number(this.amount) > 0
        && Number(this.amount) < 1000000;

    }
    return result;
  }

  public validDollarAmount(amount: any): boolean {
    let str = String(amount);
    let pattern = new RegExp('(^[1-9]{1}(|[0-9]{1,5})(|\.[0-9]{2})$)|(^(|0)\.[0-9]{2}$)');
    if ( pattern.test(str) ) {
      return true;
    }
    return false;
  }

  public resetPaymentDetails(): void {
    _.each([
      'paymentType',
      'accountType',
      'accountName',
      'accountNumber',
      'routingNumber',
      'ccNumber',
      'expDate',
      'cvv',
      'zipCode'
    ], (f) => {
      if (f === 'accountType') {
        this[f] = 'individual';
      } else {
        delete(this[f]);
      }
    });
  }

  public setBillingInfo(pmtInfo: PaymentInfo): void {
    if (pmtInfo.default_source.credit_card.last4 != null) {
      this.accountLast4 = pmtInfo.default_source.credit_card.last4;
      this.paymentType = 'cc';
    }
    if (pmtInfo.default_source.bank_account.last4 != null) {
      this.accountLast4 = pmtInfo.default_source.bank_account.last4;
      this.paymentType = 'ach';
    }
  }

  /*******************
   * PRIVATE FUNCTIONS
   *******************/

  private parseParamOrSetError(paramName, queryParams): any {
    let isValid: boolean = queryParams[paramName] ?
        this.helper.isValidParam(paramName, queryParams[paramName], queryParams) : null;
    let isRequired: boolean =  this.helper.isParamRequired(paramName, queryParams[this.helper.params.type]);
    let parsedParam: any = undefined;

    if (isValid && isRequired) {
      parsedParam = queryParams[paramName];
    } else if (!isValid && isRequired) {
      parsedParam = null;
      this.errors.push(`${paramName} is missing or invalid`);
    } else if (isValid && !isRequired) {
      parsedParam = this.helper.castParamToProperType(paramName, queryParams[paramName]);
    } else if (!isValid && !isRequired) {
      parsedParam = null;
    }

    return parsedParam;
  }

  private processQueryParams(): void {
    this.queryParams = this.route.snapshot.queryParams;

    if (this.queryParams['theme'] === 'dark') {
      this.setTheme('dark-theme');
    }

    if ( this.queryParams[this.helper.params.override_parent] === 'false' ) {
      this.overrideParent = false;
      console.log('override parent!');
    }

    this.type = this.queryParams[this.helper.params.type];

    if (this.type === this.helper.types.payment || this.type === this.helper.types.donation) {
      this.invoiceId = this.parseParamOrSetError(this.helper.params.invoice_id, this.queryParams);
      this.totalCost = this.parseParamOrSetError(this.helper.params.total_cost, this.queryParams);
      this.minPayment = this.parseParamOrSetError(this.helper.params.min_payment, this.queryParams);

      this.title = this.parseParamOrSetError(this.helper.params.title, this.queryParams);
      this.url = this.parseParamOrSetError(this.helper.params.url, this.queryParams);
      this.fundId = this.parseParamOrSetError(this.helper.params.fund_id, this.queryParams);
    } else {
      this.errors.push('Invalid type');
    }

    if (this.type === this.helper.types.donation) {
      this.state.unhidePage(this.state.fundIndex);
    }

  }

  private setTheme(theme): void {
    document.body.classList.add(theme);
  }

  public isDonation() {
    if ( this.type === 'donation' ) {
      return true;
    } else {
      return false;
    }
  }

  public isPayment() {
    if ( this.type === 'payment' ) {
      return true;
    } else {
      return false;
    }
  }

  public isOneTimeGift(): boolean {
    return this.frequency === 'One Time';
  }

  public isRecurringGift(): boolean {
    return (this.frequency === 'week' || this.frequency === 'month');
  }

  public isRecurringGiftWithNoStartDate(): boolean {
    return !this.isOneTimeGift() && !this.start_date;
  }

  public isExistingPaymentMethod(): boolean {
    if (!this.donor && this.accountLast4) {
      return true;
    }
    return false;
  }

  public isNewPaymentMethod(): boolean {
    if (this.donor && !this.accountLast4) {
      return true;
    }
    return false;
  }

  public resetErrors() {
    this.stripeException = false;
    this.systemException = false;
  }

  public validateRoute(router) {
    if (!this.type) {
      this.state.setLoading(true);
      router.navigateByUrl('/');
    }
  }

}
