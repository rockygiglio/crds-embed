import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GivingStore } from './giving-state/giving.store';
import { GivingState } from './giving-state/giving.interfaces';

import { PreviousGiftAmountService } from './services/previous-gift-amount.service';
import { QuickDonationAmountsService } from './services/quick-donation-amounts.service';
import { GiftService } from './services/gift.service';

@Component({
  selector: 'app-root',
  template: '<div class="prototype-component container"><router-outlet></router-outlet></div>',
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  action: string;
  type: string;

  constructor(@Inject(GivingStore) private store: any,
              private route: ActivatedRoute,
              private router: Router,
              private gift: GiftService,
              private quickAmts: QuickDonationAmountsService,
              private prevAmt: PreviousGiftAmountService) {
    store.subscribe(() => this.readState());
  }

  readState() {
    let state: GivingState = this.store.getState() as GivingState;
    this.action = state.action;
    this.router.navigate([this.action], { relativeTo: this.route });
  }
}
