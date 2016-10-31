import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

import * as _ from "lodash";

@Injectable()
export class ParameterService {

  private queryParams: Object;

  public invoiceId: number = 0;
  public totalCost: number = 0;
  public minPayment: number = 0;
  public title: string = '';
  public url: string = '';
  public type: string = '';

  public errors: Array<string> = [];

  constructor(private http: Http,
              private route: ActivatedRoute) {
    this.processQueryParams();
  }

  processQueryParams() {
    this.queryParams = this.route.snapshot.queryParams;

    this.type = this.queryParams['type'];

    if (this.type === 'payment' || this.type === 'donation') {
      this.invoiceId = this.validate('invoice_id', +this.queryParams['invoice_id']);
      this.totalCost = this.validate('total_cost', +this.queryParams['total_cost']);
      this.minPayment = this.validate('min_payment', +this.queryParams['min_payment']);
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
