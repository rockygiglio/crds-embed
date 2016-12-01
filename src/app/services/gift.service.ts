import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ExistingPaymentInfoService, PaymentInfo } from './existing-payment-info.service';
import { LoginService } from './login.service';
import { ParamValidationService } from './param-validation.service';
import { Program } from '../interfaces/program';
import { StateManagerService } from './state-manager.service';

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

  constructor(private existingPaymentInfoService: ExistingPaymentInfoService,
              private helper: ParamValidationService,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private stateManagerService: StateManagerService) {
    this.processQueryParams();
    this.preloadData();
    this.isInitialized = true;
  }

  public loadExistingPaymentData(): void {
    this.existingPaymentInfo = this.existingPaymentInfoService.getExistingPaymentInfo();
    this.existingPaymentInfo.subscribe(
        info => {
          if ( info !== null ) {
            this.setBillingInfo(info);
            if (this.accountLast4) {
              this.stateManagerService.hidePage(this.stateManagerService.billingIndex);
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
      this.stateManagerService.hidePage(this.stateManagerService.authenticationIndex);
      this.loadUserData();
    }
  }

  public resetExistingPaymentInfo(): void {
    this.stateManagerService.unhidePage(this.stateManagerService.billingIndex);
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
      this.stateManagerService.unhidePage(this.stateManagerService.fundIndex);
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

}
