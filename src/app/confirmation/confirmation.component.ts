import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

import { DynamicReplace } from '../models/dynamic-replace';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {

  private messageBody: string = '';
  private footerText: string = '';

  constructor(
    private store: StoreService,
    private state: StateService,
    private router: Router) {
    this.store.validateRoute(router);
    this.state.setLoading(false);
  }

  public ngOnInit(): void {

    let amount = '0.00';
    if ( this.store.amount ) {
      amount = new CurrencyPipe('en-US').transform(this.store.amount, 'USD', true);
    }

    let fund = '';
    if ( this.store.fund ) {
      fund = this.store.fund.Name;
    }

    if ( this.store.isPayment() ) {
      this.messageBody = this.store.content.getContent('embedConfirmationPaymentBody');
      this.messageBody = this.store.dynamicData(this.messageBody, new DynamicReplace('amount', amount));
      if ( this.store.title ) {
        this.messageBody += ' for ' + this.store.title;
      }
      this.footerText = this.store.content.getContent('embedConfirmationPaymentReceipt');
      this.footerText = this.store.dynamicData(this.footerText, new DynamicReplace('email', this.store.email));

    } else {

      if ( this.store.isRecurringGift() ) {
        this.messageBody = this.store.content.getContent('embedConfirmationRecurringBody');
        this.messageBody = this.store.dynamicDatas(this.messageBody,
          [
            new DynamicReplace('amount', amount),
            new DynamicReplace('fund', fund),
            new DynamicReplace('frequency', this.store.frequency.value),
            new DynamicReplace('frequencyCalculation', this.frequencyCalculation()),
            new DynamicReplace('startDate', new DatePipe('en-US').transform(this.store.startDate, 'MM/dd/yyyy')),
          ]
        );
        this.footerText = this.store.content.getContent('embedConfirmationRecurringStatement');
        this.footerText = this.store.dynamicData(this.footerText, new DynamicReplace('email', this.store.email));

      } else {
        this.messageBody = this.store.content.getContent('embedConfirmationOneTimeBody');
        this.messageBody = this.store.dynamicDatas(this.messageBody,
          [
            new DynamicReplace('amount', amount),
            new DynamicReplace('fund', fund),
          ]
        );
        this.footerText = this.store.content.getContent('embedConfirmationOneTimeStatement');
        this.footerText = this.store.dynamicData(this.footerText, new DynamicReplace('email', this.store.email));

      }
    }

    this.state.is_loading = false;
  }

  public frequencyCalculation(): string {
    let startDate = moment(this.store.startDate);
    if (this.store.frequency.value === 'month') {
      return 'the ' + startDate.format('Do');
    }
    return startDate.format('dddd');
  }

}
