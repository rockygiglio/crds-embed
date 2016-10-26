import { Component, Inject } from '@angular/core';
import { PrototypeGiftService } from '../prototype-gift.service';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';

@Component({
  selector: 'app-prototype-switch',
  template: '',
  styleUrls: []
})
export class PrototypeSwitchComponent {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) {

    this.gift.flow_type = this.gift.flow_type == 'payment' ? 'gift' : 'payment';
    this.gift.reset();

    console.log(this.gift.flow_type);

    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/amount'));
  }

}