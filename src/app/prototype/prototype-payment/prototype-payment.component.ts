import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype.store';
import * as PrototypeActions from '../prototype.action-creators';

@Component({
  selector: 'app-prototype-payment',
  templateUrl: './prototype-payment.component.html',
  styleUrls: ['./prototype-payment.component.css']
})
export class PrototypePaymentComponent {

  constructor(@Inject(PrototypeStore) private store: any) {}

  back() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('summary'));
    return false;
  }

}
