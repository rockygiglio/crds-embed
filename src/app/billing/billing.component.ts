import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GiftService } from "../services/gift.service";
import { GivingStore } from "../giving-state/giving.store";

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  paymentMethod: string = 'Bank Account';
  achForm: FormGroup;
  ccForm: FormGroup;
  hideCheck: boolean = true;

  constructor(@Inject(GivingStore) private store: any,
              private gift: GiftService,
              private fb: FormBuilder) { }

  ngOnInit() {
    if (this.gift.type) {
      this.gift.resetPaymentDetails();
    }

    this.achForm = this.fb.group({
      account_holder_name: ['', [<any>Validators.required]],
      routing_number: ['', [<any>Validators.required]],
      ach_account_number: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      account_type: ['personal', [<any>Validators.required]]
    });

    this.ccForm = this.fb.group({
      cc_account_number: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      exp_date: ['', [<any>Validators.required]],
      cvv: ['', [<any>Validators.required]],
      zip_code: ['', [<any>Validators.required]]
    });
  }

  back() {
    // this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/details'));
    return false;
  }

  achNext() {
    if (this.achForm.valid) {
      this.gift.paymentType = 'ach';
      // this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/summary'));
    }
    return false;
  }

  ccNext() {
    if (this.ccForm.valid) {
      this.gift.paymentType = 'cc';
      // this.store.dispatch(GivingActions.render(this.gift.flow_type + '/summary'));
    }
    return false;
  }

}
