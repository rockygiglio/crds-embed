import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype.store';
import * as PrototypeActions from '../prototype.action-creators';

@Component({
  selector: 'app-prototype-amount',
  templateUrl: './prototype-amount.component.html',
  styleUrls: ['./prototype-amount.component.css']
})
export class PrototypeAmountComponent {

  constructor(@Inject(PrototypeStore) private store: any) {}

  next() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

}
