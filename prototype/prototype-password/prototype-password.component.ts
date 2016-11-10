import { Component, Inject } from '@angular/core';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-password',
  templateUrl: './prototype-password.component.html',
  styleUrls: ['./prototype-password.component.scss']
})
export class PrototypePasswordComponent {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) { }

  back() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/auth'));
    return false;
  }

}
