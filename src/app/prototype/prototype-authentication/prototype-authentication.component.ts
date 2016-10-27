import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { CheckGuestEmailService } from '../../../app/services/check-guest-email.service';

@Component({
  selector: 'app-prototype-authentication',
  templateUrl: './prototype-authentication.component.html',
  styleUrls: ['./prototype-authentication.component.css'],
  providers: [CheckGuestEmailService]
})
export class PrototypeAuthenticationComponent implements OnInit {
  public signinOption:string = 'Sign In';

  form: FormGroup;
  email: string;
  guestEmail: boolean;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder,
              private checkGuestEmailService: CheckGuestEmailService
              ) {}

  back() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/details'));
    return false;
  }

  adv() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/payment'));
  }

  next() {
    if (this.form.valid) {
      this.adv();
    }
    return false;
  }

  guest() {
    if (this.form.valid) {
      this.gift.is_guest = true;
      this.adv();
    }
    return false;
  }

 checkEmail(event) {
    this.checkGuestEmailService.guestEmailExists(event.target.value).subscribe(
      resp => { this.guestEmail = resp; }
    );
 }

  ngOnInit() {

    if (this.gift.email) {
      this.adv();
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
