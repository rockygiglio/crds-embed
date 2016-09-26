import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-authentication',
  templateUrl: './prototype-authentication.component.html',
  styleUrls: ['./prototype-authentication.component.css']
})
export class PrototypeAuthenticationComponent implements OnInit {
  form: FormGroup;
  email: string;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {}

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

    this.form = this._fb.group({
      email: [this.gift.email, [<any>Validators.required, <any>Validators.pattern('^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$')]],
      password: ['']
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.gift.email = value.email;
    });

  }

}
