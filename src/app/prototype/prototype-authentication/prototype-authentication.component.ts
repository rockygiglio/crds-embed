import { Component, OnInit, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-authentication',
  templateUrl: './prototype-authentication.component.html',
  styleUrls: ['./prototype-authentication.component.css']
})
export class PrototypeAuthenticationComponent implements OnInit {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) {}

  back() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('payment'));
    return false;
  }

  ngOnInit() {
    if(this.gift.email) {
      this.next();
    }
  }

}
