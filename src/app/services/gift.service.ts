import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParamValidationService } from './param-validation.service';

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

  public amount: number;
  public customAmount: number;

  constructor(private route: ActivatedRoute,
              private hlpr: ParamValidationService) {
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

  /*******************
   * PRIVATE FUNCTIONS
   *******************/

  parseParamOrSetError(paramName, queryParams) {

    let isValid: boolean = queryParams[paramName] ?
        this.hlpr.isValidParam(paramName, queryParams[paramName], queryParams) : null;
    let isRequired: boolean =  this.hlpr.isParamRequired(paramName, queryParams[this.hlpr.embedParamNames.type]);

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

    this.type = this.queryParams[this.hlpr.embedParamNames.type];

    if (this.type === this.hlpr.flowTypes.payment || this.type === this.hlpr.flowTypes.donation) {
      this.invoiceId = this.parseParamOrSetError(this.hlpr.embedParamNames.invoice_id, this.queryParams);
      this.totalCost = this.parseParamOrSetError(this.hlpr.embedParamNames.total_cost, this.queryParams);
      this.minPayment = this.parseParamOrSetError(this.hlpr.embedParamNames.min_payment, this.queryParams);

      this.title = this.parseParamOrSetError(this.hlpr.embedParamNames.title, this.queryParams);
      this.url = this.parseParamOrSetError(this.hlpr.embedParamNames.url, this.queryParams);
      this.fundId = this.parseParamOrSetError(this.hlpr.embedParamNames.fund_id, this.queryParams);
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

  private validate(key: string, value: number) {
    if (isNaN(value) && this.type === 'payment') {
      this.errors.push(`${key} is missing or invalid`);
    }
    return value;
  }
}
