import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-email',
  templateUrl: './prototype-email.component.html',
  styleUrls: ['./prototype-email.component.scss']
})
export class PrototypeEmailComponent implements OnInit {
  form: FormGroup;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) { }

  back() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/auth'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/summary'));
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
