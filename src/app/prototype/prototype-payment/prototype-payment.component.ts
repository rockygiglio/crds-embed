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
    if (this.gift.payment_type) {
      this.gift.resetPaymentDetails();
    }

    this.achForm = this._fb.group({
      name: ['', [<any>Validators.required]],
      routing_number: ['', [<any>Validators.required]],
      ach_account_number: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      account_type: ['', [<any>Validators.required]]
    });

    this.ccForm = this._fb.group({
      cc_account_number: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      exp_date: ['', [<any>Validators.required]],
      cvv: ['', [<any>Validators.required]],
      zip_code: ['', [<any>Validators.required]]
    });
  }

  back() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

  achNext() {
    this.gift.payment_type = 'ach';
    this.store.dispatch(PrototypeActions.render('summary'));
    return false;
  }

  ccNext() {
    this.gift.payment_type = 'cc';
    this.store.dispatch(PrototypeActions.render('summary'));
    return false;
  }

}
