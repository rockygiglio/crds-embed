import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as GivingActions from '../giving-state/giving.action-creators';
import { GivingStore } from '../giving-state/giving.store';
import { GiftService } from '../services/gift.service';
import { CheckGuestEmailService } from '../services/check-guest-email.service';
import { LoginService } from '../services/login.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { UserSessionService } from '../services/user-session.service';

@Component({
  selector: 'app-prototype-authentication',
  templateUrl: './prototype-authentication.component.html',
  styleUrls: ['./prototype-authentication.component.css'],
  providers: [CheckGuestEmailService]
})
export class AuthenticationComponent implements OnInit {
  public signinOption: string = 'Sign In';

  form: FormGroup;
  email: string;
  guestEmail: boolean;
  userPmtInfo: any;

  constructor( @Inject(GivingStore) private store: any,
    private gift: GiftService,
    private _fb: FormBuilder,
    private checkGuestEmailService: CheckGuestEmailService,
    private loginService: LoginService,
    private existingPaymentInfoService: ExistingPaymentInfoService,
    private userSessionService: UserSessionService
  ) { }

  back() {
    this.store.dispatch(GivingActions.render(this.gift.type + '/details'));
    return false;
  }

  adv() {
    this.store.dispatch(GivingActions.render(this.gift.type + '/payment'));
  }

  next() {
    if (this.form.valid) {
      this.loginService.login(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        user => {
          // this.getUserPaymentInfo(user.userToken);
          this.adv();
        },
        error => {
          this.adv();
        }
      );
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

  checkEmail(event: any) {
    this.checkGuestEmailService.guestEmailExists(event.target.value).subscribe(
      resp => { this.guestEmail = resp; }
    );
  }

  ngOnInit() {

    if ( this.userSessionService.isLoggedIn()) {
      this.gift.email = this.userSessionService.getUserEmail();
      this.adv();
    }

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

    this.loading = false;
  }

}
