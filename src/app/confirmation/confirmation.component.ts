import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

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

    let recurringMessage = this.store.content.getContent('embedConfirmationRecurringBody');
    let oneTimeMessage = this.store.content.getContent('embedConfirmationOneTimeBody');
    let paymentMessage = this.store.content.getContent('embedConfirmationPaymentBody');
    let amount = '0.00';
    if ( this.store.amount ) {
      amount = new CurrencyPipe('en-US').transform(this.store.amount, 'USD', true);
    }

    let fund = '';
    if ( this.store.fund ) {
      fund = this.store.fund.Name;
    }

    if ( this.store.isPayment() ) {

      this.messageBody = paymentMessage.replace('{{ amount }}', amount);
      if ( this.store.title ) {
        this.messageBody += ' for ' + this.store.title;
      }
      this.footerText = this.store.content.getContent('embedConfirmationPaymentReceipt').replace('{{ email }}', this.store.email)

    } else {

      if ( this.store.isRecurringGift() ) {

        this.messageBody = recurringMessage.replace('{{ amount }}', amount);
        this.messageBody = this.messageBody.replace('{{ fund }}', fund);
        this.messageBody = this.messageBody.replace('{{ frequency }}', this.store.frequency.value);
        this.messageBody = this.messageBody.replace('{{ frequencyCalculation }}', this.frequencyCalculation());
        this.messageBody = this.messageBody.replace('{{ startDate }}', new DatePipe('en-US').transform(this.store.startDate, 'mm/dd/yyyy'));
        this.footerText = this.store.content.getContent('embedConfirmationRecurringStatement').replace('{{ email }}', this.store.email);

      } else {

        this.messageBody = oneTimeMessage.replace('{{ amount }}', amount);
        this.messageBody = this.messageBody.replace('{{ fund }}', fund);
        this.footerText = this.store.content.getContent('embedConfirmationOneTimeStatement').replace('{{ email }}', this.store.email);

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
