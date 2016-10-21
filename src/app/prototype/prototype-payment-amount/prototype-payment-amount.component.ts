import { Inject, Component } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-payment-amount',
  templateUrl: './prototype-payment-amount.component.html',
  styleUrls: ['./prototype-payment-amount.component.scss']
})
export class PrototypePaymentAmountComponent {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) {
    this.gift.flow_type = 'payment';
  }

  next() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/auth'));
    return false;
  }

}
