import { Component, Inject } from '@angular/core';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-summary',
  templateUrl: './prototype-summary.component.html',
  styleUrls: ['./prototype-summary.component.scss']
})
export class PrototypeSummaryComponent {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) {}

  back() {
    this.store.dispatch(PrototypeActions.render('payment'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('confirmation'));
    return false;
  }

  isGuest() {
    return this.gift.is_guest;
  }

}
