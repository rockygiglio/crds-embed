import { Injectable } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class GiftService {

  private queryParams: Object;

  public invoiceId: number = 0;
  public totalCost: number = 0;
  public minPayment: number = 0;
  public title: string = '';
  public url: string = '';
  public type: string = '';

  public errors: Array<string> = [];

  public amount: number;
  public customAmount: number;

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

    return result
  }

  /*******************
   * PRIVATE FUNCTIONS
   *******************/

  private processQueryParams() {
    this.queryParams = this.route.snapshot.queryParams;

    this.type = this.queryParams['type'];



    if (this.type === 'payment' || this.type === 'donation') {
      // this.invoiceId = this.validate('invoice_id', +this.queryParams['invoice_id']);
      // this.totalCost = this.validate('total_cost', +this.queryParams['total_cost']);
      // this.minPayment = this.validate('min_payment', +this.queryParams['min_payment']);

      /**
       * TODO testing only
       */
      this.invoiceId = 1234;
      this.totalCost = 400;
      this.minPayment = 100;

      this.title = this.queryParams['title'] || '';
      this.url = this.queryParams['url'] || '';
    } else {
      this.errors.push('Invalid type')
    }
  }

  private validate(key, value) {
    if(isNaN(value) && this.type === 'payment') {
      this.errors.push(`${key} is missing or invalid`);
    }
    return value;
  }
}
