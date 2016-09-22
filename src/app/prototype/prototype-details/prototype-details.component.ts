import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';

@Component({
  selector: 'app-prototype-details',
  templateUrl: './prototype-details.component.html',
  styleUrls: ['./prototype-details.component.css']
})
export class PrototypeDetailsComponent {

  constructor(@Inject(PrototypeStore) private store: any) {}

  back() {
    this.store.dispatch(PrototypeActions.render('amount'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('auth'));
    return false;
  }

}
