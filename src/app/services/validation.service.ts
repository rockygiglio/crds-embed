import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable()
export class ValidationService {
  public types: any;
  public params: any;
  public requiredPmtParams: any[];
  public radix: number;
  public emailRegex: string = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$';

  constructor() {
    this.types = {
      payment:  'payment',
      donation: 'donation'
    };
    this.params = {
      type:        'type',
      invoice_id:  'invoice_id',
      total_cost:  'total_cost',
      min_payment: 'min_payment',
      title:       'title',
      url:         'url',
      fund_id:     'fund_id',
      override_parent: 'override_parent'
    };
    this.requiredPmtParams = [
      this.params.invoice_id,
      this.params.total_cost,
      this.params.min_payment
    ];
    this.radix = 10;
  }

  public isInt(n) {
    return n % 1 === 0;
  }

  public isIntGreaterThanZero(x) {
    let isANumber: boolean = !isNaN(x);
    let isGreaterThanZero: boolean = x > 0;
    let isInteger = isANumber ? this.isInt(x) : false;
    let isIntGreaterThanZero: boolean = isANumber && isGreaterThanZero && isInteger;
    return isIntGreaterThanZero;
  }

  public isParamRequired(paramName, flowType) {
    if (flowType === this.types.donation) {
      return false;
    } else if (flowType === this.types.payment) {
      return _.includes(this.requiredPmtParams, paramName);
    } else {
      return false;
    }
  }

  public isTypeParamValid(typeParam: any) {
    return typeParam === this.types.payment || typeParam === this.types.donation;
  }

  public isInvoiceIdValid(invoiceIdParam: any) {
    return this.isIntGreaterThanZero(invoiceIdParam);
  }

  public isTotalCostValid(totalCostParam: any) {
    let isGreaterThanZero: boolean = totalCostParam > 0;
    let isDecimal: boolean         = totalCostParam.match(/^(\d+\.?\d{0,9}|\.\d{1,9})$/);
    let isValid: boolean = isDecimal && isGreaterThanZero;
    return isValid;
  }

  public isMinPaymentValid(minPaymentParam: any, totalCostParam: any) {
    let isGreaterThanZero: boolean   = totalCostParam > 0;
    let isDecimal: boolean           = minPaymentParam.match(/^(\d+\.?\d{0,9}|\.\d{1,9})$/);
    let isLessThanOrEqualToTotalCost = parseInt(minPaymentParam, this.radix) <= parseInt(totalCostParam, this.radix);
    let isValid: boolean = isDecimal && isGreaterThanZero && isLessThanOrEqualToTotalCost;
    return isValid;
  }

  public isTitleValid(titleParam: any) {
    let isAtLeastOneCharLong: boolean = titleParam.length > 0;
    let isValid: boolean              = isAtLeastOneCharLong;
    return isValid;
  }

  public isUrlValid(urlParam: any) {
    let urlRegEx: any = /^http(s|)\:\/\/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let isUrlValid: boolean = urlParam.match(urlRegEx);
    let isValid: boolean = isUrlValid;
    return isValid;
  }

  public isFundIdValid(fundIdParam: any) {
    return this.isIntGreaterThanZero(fundIdParam);
  }

  public castParamToProperType(paramName, paramValue) {
    let castParam = undefined;
    switch (paramName) {
      case this.params.type:
      case this.params.title:
      case this.params.url:
        castParam = paramValue || '';
        break;
      case this.params.invoice_id:
      case this.params.fund_id:
        castParam = parseInt(paramValue, this.radix) || 0;
        break;
      case this.params.total_cost:
      case this.params.min_payment:
        castParam = parseFloat(paramValue) || 0;
        break;
      default:
        castParam = null;
    }
    return castParam;
  }

  public isValidParam(paramName, param, queryParams) {
    let isValid = undefined;
    switch (paramName) {
      case this.params.type:
        isValid = this.isTypeParamValid(param);
        break;
      case this.params.invoice_id :
        isValid = this.isInvoiceIdValid(param);
        break;
      case this.params.total_cost:
        isValid = this.isTotalCostValid(param);
        break;
      case this.params.min_payment:
        isValid = this.isMinPaymentValid(param, queryParams[this.params.total_cost]);
        break;
      case this.params.title:
        isValid = this.isTitleValid(param);
        break;
      case this.params.url:
        isValid = this.isUrlValid(param);
        break;
      case this.params.fund_id:
        isValid = this.isFundIdValid(param);
        break;
      default:
        isValid = false;
    }
    return isValid;
  }

  public validDollarAmount(amount: any): boolean {
    let str = String(amount);
    let pattern = new RegExp('(^[1-9]{1}(|[0-9]{1,5})(|\.[0-9]{0,2})$)|(^(|0)\.[0-9]{0,2}$)');
    if (pattern.test(str)) {
      return true;
    }
    return false;
  }
}
