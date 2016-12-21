import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { ContentService } from './content.service';
import { StateService } from './state.service';
import { ValidationService } from './validation.service';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { Frequency } from '../models/frequency';
import { Fund } from '../models/fund';
import { Donor } from '../models/donor';
import { RecurringDonor } from '../models/recurring-donor';

declare var _;

@Injectable()
export class StoreService {

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
  public minimumStripeAmount: number = 0.50;

  private queryParams: Object;

  // Form options
  public predefinedAmounts: number[];
  public existingPaymentInfo: Observable<any>;
  public paymentMethod: string = 'Bank Account';
  public amountLocked: boolean = false;

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
  public donor: Donor;
  public recurringDonor: RecurringDonor;

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
  public fund: Fund = undefined;
  public funds: Array<Fund>;
  public startDate: Date;
  public frequency: Frequency;
  public frequencies: Array<Frequency>;

  public userBank: CustomerBank = undefined;
  public userCc: CustomerCard = undefined;

  // Predefined or custom donation dollar amount
  public isPredefined: boolean = undefined;

  constructor(
    private api: APIService,
    private validation: ValidationService,
    private route: ActivatedRoute,
    private state: StateService,
    public content: ContentService
    ) {
    this.processQueryParams();
    this.preloadData();
    this.preloadFrequencies();
    this.isInitialized = true;
  }

  public clearUserPmtInfo() {
    this.userBank = undefined;
    this.userCc = undefined;
  }

  public loadExistingPaymentData(): void {

    if (this.isFrequencySetAndNotOneTime()) {
      this.resetExistingPmtInfo();
      this.clearUserPmtInfo();
      this.state.unhidePage(this.state.billingIndex);
      return;
    }

    this.existingPaymentInfo = this.api.getExistingPaymentInfo();
    this.existingPaymentInfo.subscribe(
      info => {
        if (info !== null) {
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
    this.api.getAuthentication().subscribe(
      (info) => {
        if (info !== null) {
          this.email = info.userEmail;
        } else {
          this.api.logOut();
        }
      }
    );
  }

  public preloadData(): void {
    if (this.api.isLoggedIn()) {
      this.state.hidePage(this.state.authenticationIndex);
      this.loadUserData();
    }
    this.loadDate();
    this.content.loadData(Array('giving'));
  }

  public loadDate() {
    this.startDate = new Date();
    this.startDate.setHours(0, 0, 0, 0);
  }

  public preloadFrequencies() {
    this.api.getFrequencies().subscribe(
      (frequencies) => {
        this.frequencies = frequencies;
        this.frequency = this.getFirstNonRecurringFrequency();
      }
    );
  }

  public getFirstNonRecurringFrequency(): Frequency {
    for (let i = 0; i < this.frequencies.length; i++) {
      if ( this.frequencies[i].recurring === false) {
        return this.frequencies[i];
      }
    }
  }

  public resetExistingPmtInfo(): void {
    this.state.unhidePage(this.state.billingIndex);
    this.accountLast4 = null;

    let emptyPaymentInfo: any = {
      default_source: {
        credit_card: { last4: null },
        bank_account: { last4: null }
      }
    };
    this.existingPaymentInfo = Observable.of(emptyPaymentInfo);
  };

  public validAmount() {
    let result = false;
    if (this.isPayment()) {
      result = !isNaN(this.amount)
        && this.validation.validDollarAmount(this.amount)
        && Number(this.amount) >= this.minimumStripeAmount
        && Number(this.amount) >= this.minPayment
        && Number(this.amount) <= this.totalCost;
    } else if (this.isDonation()) {
      result = !isNaN(this.amount)
        && this.validation.validDollarAmount(this.amount)
        && Number(this.amount) >= this.minimumStripeAmount
        && Number(this.amount) < 1000000;
    }
    return result;
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
        delete (this[f]);
      }
    });
  }

  public setBillingInfo(paymentInfo: any): void {
    if (paymentInfo.default_source.credit_card.last4 != null) {
      this.accountLast4 = paymentInfo.default_source.credit_card.last4;
      this.paymentType = 'cc';
    }
    if (paymentInfo.default_source.bank_account.last4 != null) {
      this.accountLast4 = paymentInfo.default_source.bank_account.last4;
      this.paymentType = 'ach';
    }
  }

  public setIsPredefined(newValue: boolean): void {
    this.isPredefined = newValue;
  }

  private parseParamOrSetError(paramName, queryParams): any {
    let isValid: boolean = queryParams[paramName] ?
      this.validation.isValidParam(paramName, queryParams[paramName], queryParams) : null;
    let isRequired: boolean = this.validation.isParamRequired(paramName, queryParams[this.validation.params.type]);
    let parsedParam: any = undefined;

    if (isValid && isRequired) {
      parsedParam = queryParams[paramName];
    } else if (!isValid && isRequired) {
      parsedParam = null;
      this.errors.push(`${paramName} is missing or invalid`);
    } else if (isValid && !isRequired) {
      parsedParam = this.validation.castParamToProperType(paramName, queryParams[paramName]);
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
    if (this.queryParams[this.validation.params.override_parent] === 'false') {
      this.overrideParent = false;
    }

    this.type = this.queryParams[this.validation.params.type];

    if (this.type === this.validation.types.payment || this.type === this.validation.types.donation) {
      this.invoiceId = this.parseParamOrSetError(this.validation.params.invoice_id, this.queryParams);
      this.totalCost = this.parseParamOrSetError(this.validation.params.total_cost, this.queryParams);
      this.minPayment = this.parseParamOrSetError(this.validation.params.min_payment, this.queryParams);
      this.title = this.parseParamOrSetError(this.validation.params.title, this.queryParams);
      this.url = this.parseParamOrSetError(this.validation.params.url, this.queryParams);
      this.fundId = this.parseParamOrSetError(this.validation.params.fund_id, this.queryParams);
    } else {
      this.errors.push('Invalid type');
    }

    if (this.type === this.validation.types.donation) {
      this.state.unhidePage(this.state.fundIndex);
    }

  }

  private setTheme(theme): void {
    document.body.classList.add(theme);
  }

  public isDonation() {
    if (this.type === 'donation') {
      return true;
    } else {
      return false;
    }
  }

  public isPayment() {
    if (this.type === 'payment') {
      return true;
    } else {
      return false;
    }
  }

  public isFrequencySetAndNotOneTime() {
    return this.isFrequencySelected() && !this.isOneTimeGift();
  }

  public isFrequencySelected(): boolean {
    return (this.frequency !== null && this.frequency !== undefined);
  }

  public isOneTimeGift(): boolean {
    return (this.frequency.recurring === false);
  }

  public isRecurringGift(): boolean {
    return (this.frequency.recurring === true);
  }

  public isRecurringGiftWithNoStartDate(): boolean {
    return this.isRecurringGift() && !this.startDate;
  }

  public isUsingExistingPaymentMethod(): boolean {
    if (!this.donor && this.accountLast4) {
      return true;
    }
    return false;
  }

  public isUsingNewPaymentMethod(): boolean {
    if ((this.donor || this.recurringDonor) && !this.accountLast4) {
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

  public preSubmit(event, noBlur = false) {
    event.preventDefault();
    if (noBlur === false) {
      this.blurInputField(event);
    }
  }

  public blurInputField(event) {
    if (event.target !== undefined) {
      event.target.blur();
    } else if (event.srcElement !== undefined) {
      event.srcElement.blur();
    } else if (event.originalTarget !== undefined) {
      event.originalTarget.blur();
    }
  }

}
