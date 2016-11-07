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
              private hlpr: ParamValidationService,) {
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

  parseParamOrSetError(paramName, queryParams){

    let isValid: boolean = queryParams[paramName] ? this.hlpr.isValidParam(paramName, queryParams[paramName], queryParams) : null;
    let isRequired: boolean =  this.hlpr.isParamRequired(paramName, queryParams[this.hlpr.embedParamNames.type]);

    let parsedParam: any = undefined;

    if(isValid && isRequired){
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

    this.type = this.queryParams['type'];

    if (this.type === 'payment' || this.type === 'donation') {
      this.invoiceId = this.parseParamOrSetError('invoice_id', this.queryParams);
      this.totalCost = this.parseParamOrSetError('total_cost', this.queryParams);
      this.minPayment = this.parseParamOrSetError('min_payment', this.queryParams);

      this.title = this.parseParamOrSetError('title', this.queryParams);
      this.url = this.parseParamOrSetError('url', this.queryParams);
      this.fundId = this.parseParamOrSetError('fund_id', this.queryParams);
    } else {
      this.errors.push('Invalid type');
    }

  }


}
