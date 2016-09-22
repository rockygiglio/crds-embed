import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype.store';
import * as PrototypeActions from '../prototype.action-creators';

@Component({
  selector: 'app-prototype-authentication',
  templateUrl: './prototype-authentication.component.html',
  styleUrls: ['./prototype-authentication.component.css']
})
export class PrototypeAuthenticationComponent {

  constructor(@Inject(PrototypeStore) private store: any) {}

  back() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('payment'));
    return false;
  }

}
