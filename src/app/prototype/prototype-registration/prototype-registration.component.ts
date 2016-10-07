import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-registration',
  templateUrl: './prototype-registration.component.html',
  styleUrls: ['./prototype-registration.component.scss']
})
export class PrototypeRegistrationComponent implements OnInit {
  form: FormGroup;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {}

  back() {
    this.store.dispatch(PrototypeActions.render('auth'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('payment'));
    return false;
  }

  ngOnInit() {
    this.form = this._fb.group({
      email: [this.gift.email, [<any>Validators.required, <any>Validators.pattern('^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$')]],
    });
    this.form.valueChanges.subscribe((value: any) => {
      this.gift.email = value.email;
    });
  }
}
