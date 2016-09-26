import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-payment',
  templateUrl: './prototype-payment.component.html',
  styleUrls: ['./prototype-payment.component.css']
})
export class PrototypePaymentComponent implements OnInit {
  achForm: FormGroup;
  ccForm: FormGroup;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.achForm = this._fb.group({
      name: ['', [<any>Validators.required]],
      routing_number: ['', [<any>Validators.required]],
      account_number: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      account_type: ['', [<any>Validators.required]]
    });

    this.ccForm = this._fb.group({
      account_number: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      exp_date: ['', [<any>Validators.required]],
      cvv: ['', [<any>Validators.required]],
      zip_code: ['', [<any>Validators.required]]
    });
  }

  back() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('summary'));
    return false;
  }

  resetPayment() {
    setTimeout(() => this.gift.account_number = '');
    return false;
  }

}
