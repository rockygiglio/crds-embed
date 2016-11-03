import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GiftService } from "../services/gift.service";
import { GivingStore } from "../giving-state/giving.store";
import * as GivingActions from '../giving-state/giving.action-creators';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  public paymentMethod: string = 'Bank Account';
  achForm: FormGroup;
  ccForm: FormGroup;
  hideCheck: boolean = true;

  constructor(@Inject(GivingStore) private store: any,
              private gift: GiftService,
              private fb: FormBuilder) { }

  ngOnInit() {
    if (!this.gift.type) {
      // this.store.dispatch(GivingActions.render('/payment'));
    }
    if (this.gift.paymentType) {
      this.gift.resetPaymentDetails();
    }

    this.achForm = this.fb.group({
      accountHolder: ['', [<any>Validators.required]],
      routingNumber: ['', [<any>Validators.required]],
      achNumber:     ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      accountType:   ['personal', [<any>Validators.required]]
    });

    this.ccForm = this.fb.group({
      ccNumber: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      expDate:  ['', [<any>Validators.required]],
      cvv:      ['', [<any>Validators.required]],
      zipCode:  ['', [<any>Validators.required]]
    });

  }

  back() {
    this.store.dispatch(GivingActions.render('/payment'));
    return false;
  }

  achNext() {
    if (this.achForm.valid) {
      this.gift.paymentType = 'ach';
      console.log(this.gift);
      // this.store.dispatch(GivingActions.render('summary'));
    }
    return false;
  }

  ccNext() {
    if (this.ccForm.valid) {
      this.gift.paymentType = 'cc';
      console.log(this.gift);
      // this.store.dispatch(GivingActions.render('summary'));
    }
    return false;
  }

}
