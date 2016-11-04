import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-payment',
  templateUrl: './prototype-payment.component.html',
  styleUrls: ['./prototype-payment.component.scss']
})
export class PrototypePaymentComponent implements OnInit {
  public paymentMethod: string = 'Bank Account';

  achForm: FormGroup;
  ccForm: FormGroup;
  hideCheck: boolean = true;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    if (this.gift.payment_type) {
      this.gift.resetPaymentDetails();
    }

    this.achForm = this._fb.group({
      account_holder_name: ['', [<any>Validators.required]],
      routing_number: ['', [<any>Validators.required]],
      ach_account_number: ['', [<any>Validators.required]],
      account_type: ['personal', [<any>Validators.required]]
    });

    this.ccForm = this._fb.group({
      cc_account_number: ['', [<any>Validators.required]],
      exp_date: ['', [<any>Validators.required]],
      cvv: ['', [<any>Validators.required]],
      zip_code: ['', [<any>Validators.required]]
    });
  }

  back() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/details'));
    return false;
  }

  achNext() {
    console.log(this.achForm);
    if (this.achForm.valid) {
      this.gift.payment_type = 'ach';
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/summary'));
    }
    return false;
  }

  ccNext() {
    if (this.ccForm.valid) {
      this.gift.payment_type = 'cc';
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/summary'));
    }
    return false;
  }

}
