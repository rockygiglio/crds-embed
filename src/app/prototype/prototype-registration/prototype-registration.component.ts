import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-registration',
  templateUrl: './prototype-registration.component.html',
  styleUrls: ['./prototype-registration.component.scss']
})
export class PrototypeRegistrationComponent {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) {}

  back() {
    this.store.dispatch(PrototypeActions.render('auth'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('payment'));
    return false;
  }
}
