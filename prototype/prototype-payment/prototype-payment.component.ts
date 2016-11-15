import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { ActivatedRoute } from '@angular/router';

interface PaymentInfo {
  id: number;
  Processor_ID: string;
  default_source: PaymentSource;
  Registered_User: boolean;
  email: string;
}

interface PaymentSource {
  credit_card: CreditCardInfo;
  bank_account: BankAccountInfo;
}

interface CreditCardInfo {
  last4: string;
  brand: string;
  address_zip: string;
  exp_date: string;
}

interface BankAccountInfo {
  routing: string;
  last4: string;
  accountHolderName: string;
  accountHolderType: string;
}

@Component({
  selector: 'app-prototype-payment',
  templateUrl: './prototype-payment.component.html',
  styleUrls: ['./prototype-payment.component.scss']
})
export class PrototypePaymentComponent implements OnInit {
  public paymentMethod: string = 'Bank Account';
  existingPaymentInfo: PaymentInfo;
  achForm: FormGroup;
  ccForm: FormGroup;
  hideCheck: boolean = true;
  loading: boolean = true;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private route: ActivatedRoute,
              private _fb: FormBuilder) {}

  ngOnInit() {

    this.gift.loading = false;

    this.achForm = this._fb.group({
      account_holder_name: ['', [<any>Validators.required]],
      routing_number: ['', [<any>Validators.required]],
      ach_account_number: ['', [<any>Validators.required]],
      account_type: ['individual', [<any>Validators.required]]
    });

    this.ccForm = this._fb.group({
      cc_account_number: ['', [<any>Validators.required]],
      exp_date: ['', [<any>Validators.required]],
      cvv: ['', [<any>Validators.required]],
      zip_code: ['', [<any>Validators.required]]
    });

    this.existingPaymentInfo = this.route.snapshot.data['existingPaymentInfo'];
    this.setUserPaymentInfo(this.existingPaymentInfo);

    if (this.gift.payment_type === 'ach') {
      this.achNext();
    } else if (this.gift.payment_type === 'cc') {
      this.ccNext();
    } else {
      this.gift.resetPaymentDetails();
    }
    this.loading = false;
  }

  back() {
    this.gift.loading = true;
    setTimeout(() => {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/details'));
    }, 500);
    return false;
  }

  achNext() {

    this.gift.payment_type = 'ach';

    this.gift.loading = true;

    setTimeout(() => {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/summary'));
    }, 500);

    return false;
  }

  ccNext() {
    // if (this.ccForm.valid) {
    this.gift.payment_type = 'cc';

    this.gift.loading = true;

    setTimeout(() => {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/summary'));
    }, 500);

    return false;
  }

  setUserPaymentInfo(pmtInfo: PaymentInfo) {
    if (pmtInfo.default_source.credit_card.last4 != null) {
      this.gift.payment_type = 'cc';
      this.gift.cc_account_number = pmtInfo.default_source.credit_card.last4;
      this.gift.exp_date = pmtInfo.default_source.credit_card.exp_date;
      // this.gift.cvv = this.pmtInfo.default_source.credit_card.?
      this.gift.zip_code = pmtInfo.default_source.credit_card.address_zip;
    }
    if (pmtInfo.default_source.bank_account.last4 != null) {
      this.gift.payment_type = 'ach';
      this.gift.account_holder_name = pmtInfo.default_source.bank_account.accountHolderName;
      this.gift.routing_number = pmtInfo.default_source.bank_account.routing;
      this.gift.ach_account_number = pmtInfo.default_source.bank_account.last4;
      this.gift.account_type = 'individual';
    }
  }

}
