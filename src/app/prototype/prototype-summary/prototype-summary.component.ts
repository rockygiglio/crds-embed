import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';

@Component({
  selector: 'app-prototype-summary',
  templateUrl: './prototype-summary.component.html',
  styleUrls: ['./prototype-summary.component.css']
})
export class PrototypeSummaryComponent {

  constructor(@Inject(PrototypeStore) private store: any) {}

  back() {
    this.store.dispatch(PrototypeActions.render('payment'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('confirmation'));
    return false;
  }

}
