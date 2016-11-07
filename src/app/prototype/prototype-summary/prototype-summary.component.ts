import { Component, Inject } from '@angular/core';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { ExistingPaymentInfoService } from '../../services/existing-payment-info.service';

@Component({
  selector: 'app-prototype-summary',
  templateUrl: './prototype-summary.component.html',
  styleUrls: ['./prototype-summary.component.scss']
})
export class PrototypeSummaryComponent {
  private lastFourOfAcctNumber: any = null;

  constructor(@Inject(PrototypeStore)
              private store: any,
              private gift: PrototypeGiftService,
              private existingPaymentInfoService: ExistingPaymentInfoService) {}

  ngOnInit() {
    this.lastFourOfAcctNumber = this.getLastFourOfAccountNumber();
  }

  getLastFourOfAccountNumber() {

    let lastFourOfPrevPmtInfo = this.existingPaymentInfoService.getLastFourOfBankOrCcAcctNum();

    let lastFourOfNewPmtInfo = this.gift.accountNumber() ?
                               this.gift.accountNumber().substr(this.gift.accountNumber().length - 4) : null;

    let lastFour: any = lastFourOfPrevPmtInfo || lastFourOfNewPmtInfo;

    return lastFour;
  }

  back() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/payment'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/confirmation'));
    return false;
  }

  isGuest() {
    return this.gift.is_guest;
  }

}
