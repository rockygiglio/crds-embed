import { Component, Inject, OnInit } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { ExistingPaymentInfoService } from '../../services/existing-payment-info.service';

@Component({
  selector: 'app-prototype-summary',
  templateUrl: './prototype-summary.component.html',
  styleUrls: ['./prototype-summary.component.scss']
})
export class PrototypeSummaryComponent implements OnInit {
  private lastFourOfAcctNumber: any = null;

  constructor(@Inject(PrototypeStore)
              private store: any,
              private gift: PrototypeGiftService,
              private existingPaymentInfoService: ExistingPaymentInfoService) {}

  ngOnInit() {
    this.gift.loading = false;
    this.lastFourOfAcctNumber = this.getLastFourOfAccountNumber();
  }

  getLastFourOfAccountNumber() {
    return this.gift.accountNumber().substr(this.gift.accountNumber().length - 4);;
  }

  back() {
    this.gift.loading = true;
    setTimeout(() => {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/payment'));
    }, 500);
    return false;
  }

  next() {
    this.gift.loading = true;

    setTimeout(() => {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/confirmation'));
    }, 500);


    return false;

  }

  isGuest() {
    return this.gift.is_guest;
  }

}
