import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParamValidationService } from './param-validation.service';
import { QuickDonationAmountsService } from './quick-donation-amounts.service';
import { DonationFundService, Program } from './donation-fund.service';
import { LoginService } from './login.service';
import { PreviousGiftAmountService } from './previous-gift-amount.service';
import { ExistingPaymentInfoService, PaymentInfo } from './existing-payment-info.service';
import { StateManagerService } from './state-manager.service';
import { Observable } from 'rxjs/Observable';

declare var _;

@Injectable()
export class GiftService {

  private queryParams: Object;

  public type: string = '';
  public invoiceId: number = 0;
  public totalCost: number = 0;
  public minPayment: number = 0;
  public title: string = '';
  public url: string = '';
  public fundId: number = 0;

  public errors: Array<string> = [];

  // Form options
  public funds: Program[];
  public amounts: number[];
  public existingPaymentInfo: Observable<any>;
  public paymentMethod: string = 'Bank Account';

  // Payment Information
  public amount: number;
  public customAmount: number;
  public paymentType: string;
  public accountLast4: string;

  // user info
  public email: string;
  public previousGiftAmount: string;
  public isGuest: boolean;

  // ACH Information
  public accountType: string = 'personal';
  public accountName: string;
  public routingNumber: string;
  public accountNumber: string;

  // Credit Card information
  public ccNumber: string;
  public expDate: string;
  public cvv: string;
  public zipCode: string;

  constructor(private route: ActivatedRoute,
              private helper: ParamValidationService,
              private donationFundService: DonationFundService,
              private quickDonationAmountService: QuickDonationAmountsService,
              private loginService: LoginService,
              private previousGiftAmountService: PreviousGiftAmountService,
              private existingPaymentInfoService: ExistingPaymentInfoService,
              private stateManagerService: StateManagerService) {
    this.processQueryParams();
    this.preloadData();
  }

  public preloadData() {
    if (this.loginService.isLoggedIn()) {
      this.stateManagerService.hidePage(this.stateManagerService.authenticationIndex);
      this.loadUserData();
    } else {
      this.loadFormData();
    }
  }

  public loadUserData() {
      this.loginService.authenticate().subscribe(
        (info) => {
          if ( info !== null ) {
            this.email = info.userEmail;
            this.loadExistingPaymentData();
          } else {
            this.loginService.logOut();
          }
        }
      );
  }

  public loadExistingPaymentData() {
    this.existingPaymentInfo = this.existingPaymentInfoService.getExistingPaymentInfo();
    if (this.type === 'donation') {
      this.previousGiftAmountService.get().subscribe(
        amount => this.previousGiftAmount = amount
      );
    }
  }

  public resetExistingPaymentInfo() {
    this.accountLast4 = null;

    let emptyPaymentInfo: any = {
      default_source: {
        credit_card: { last4: null},
        bank_account: { last4: null}
      }
    };
    this.existingPaymentInfo = Observable.of(emptyPaymentInfo);
  };

  public setBillingInfo(pmtInfo: PaymentInfo) {
    if (pmtInfo.default_source.credit_card.last4 != null) {
      this.accountLast4 = pmtInfo.default_source.credit_card.last4;
    }
    if (pmtInfo.default_source.bank_account.last4 != null) {
      this.accountLast4 = pmtInfo.default_source.bank_account.last4;
    }
  }

  private loadFormData() {
    this.donationFundService.getFunds().subscribe(
      funds => this.funds = funds
    );
    this.quickDonationAmountService.getQuickDonationAmounts().subscribe(
      amounts => this.amounts = amounts
    );
  }

  public validAmount() {
    let result = true;
    if (this.type === 'payment') {
      result = this.amount >= this.minPayment && this.amount <= this.totalCost;
    } else if (this.type === 'donation') {
      result = this.amount > 0;
    }

    return result;
  }

  public resetPaymentDetails() {
    _.each([
      'paymentType',
      'accountType',
      'accountName',
      'accountNumber',
      'routingNumber',
      'accountNumber',
      'ccNumber',
      'expDate',
      'cvv',
      'zipCode'
    ], (f) => {
      if (f === 'accountType') {
        this[f] = 'personal';
      } else {
        delete(this[f]);
      }
    });
  }


  /*******************
   * PRIVATE FUNCTIONS
   *******************/

  parseParamOrSetError(paramName, queryParams) {

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
      parsedParam = queryParams[paramName];
    } else if (!isValid && !isRequired) {
      parsedParam = null;
    }

    return parsedParam;
  }

  private processQueryParams() {
    this.queryParams = this.route.snapshot.queryParams;

    if (this.queryParams['theme'] === 'dark') {
      this.setTheme('dark-theme');
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

    // Do not remove these logs - they were requested for testing
    console.log('type ' + this.type);
    console.log('invoice_id', this.invoiceId);
    console.log('total_cost', this.totalCost);
    console.log('min_payment', this.minPayment);
    console.log('title', this.title);
    console.log('url', this.url);
    console.log('fund_id', this.fundId);

  }

  private setTheme(theme) {
    document.body.classList.add(theme);
  }

}
