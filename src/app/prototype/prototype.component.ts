import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeState } from './prototype-state/prototype.interfaces';
import { PrototypeGiftService } from './prototype-gift.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';

@Component({
  selector: 'app-prototype',
  templateUrl: 'prototype.component.html',
  styleUrls: ['../../styles/application.scss', 'prototype.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrototypeComponent implements OnInit {
  action: string;
  flowType: string;

  constructor(@Inject(PrototypeStore) private store: any,
              private route: ActivatedRoute,
              private router: Router,
              private gift: PrototypeGiftService,
              private quickAmts: QuickDonationAmountsService,
              private prevAmt: PreviousGiftAmountService) {
    store.subscribe(() => this.readState());
  }

  ngOnInit() {
    this.route.params.forEach((params) => {
      if (Object.keys(params).indexOf('type') > -1) {
        this.flowType = params['type'];
      }
    });
  }

  readState() {
    let state: PrototypeState = this.store.getState() as PrototypeState;
    this.action = state.action;
    this.router.navigate([this.action], { relativeTo: this.route });
  }

}
