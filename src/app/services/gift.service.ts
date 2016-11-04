import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var _;

@Injectable()
export class GiftService {

  private queryParams: Object;

  // Parameter Information
  public invoiceId: number = 0;
  public totalCost: number = 0;
  public minPayment: number = 0;
  public title: string = '';
  public url: string = '';
  public type: string = '';

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

  constructor(private route: ActivatedRoute) {
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

  private processQueryParams() {
    this.queryParams = this.route.snapshot.queryParams;

    this.type = this.queryParams['type'];

    if (this.type === 'payment' || this.type === 'donation') {
      this.invoiceId = this.validate('invoice_id', +this.queryParams['invoice_id']);
      this.totalCost = this.validate('total_cost', +this.queryParams['total_cost']);
      this.minPayment = this.validate('min_payment', +this.queryParams['min_payment']);

      this.title = this.queryParams['title'] || '';
      this.url = this.queryParams['url'] || '';
    } else {
      this.errors.push('Invalid type');
    }
  }

  private validate(key: string, value: number) {
    if (isNaN(value) && this.type === 'payment') {
      this.errors.push(`${key} is missing or invalid`);
    }
    return value;
  }
}
