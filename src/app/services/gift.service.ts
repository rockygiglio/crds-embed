import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParamValidationService } from './param-validation.service';

declare var _;

@Injectable()
export class GiftService {

  private queryParams: Object;

  public loading: boolean = false;
  public type: string = '';
  public invoiceId: number = 0;
  public totalCost: number = 0;
  public minPayment: number = 0;
  public title: string = '';
  public url: string = '';
  public fundId: number = 0;

  public errors: Array<string> = [];

  // Payment Information
  public amount: number;
  public customAmount: number;
  public paymentType: string;

  // user info
  public email: string;

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
              private helper: ParamValidationService) {
    this.processQueryParams();
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
      'routingNumber',
      'achNumber',
      'ccNumber',
      'expDate',
      'cvv',
      'zipCode'
    ], (f) => {
      delete(this[f]);
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
