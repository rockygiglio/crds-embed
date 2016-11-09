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
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
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
    this.store.dispatch(GivingActions.render(this.gift.getPrevPageToShow(this.gift.authenticationIndex)));
    return false;
  }

  adv() {
    this.store.dispatch(GivingActions.render(this.gift.getNextPageToShow(this.gift.authenticationIndex)));
  }

  next() {
    if (this.form.valid) {
      this.loginService.login(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        user => {
          this.userSessionService.setUserEmail(user.userEmail);
          this.gift.loadUserData();
          this.gift.paymentState[this.gift.authenticationIndex].show = false;
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
      this.gift.isGuest = true;
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

    this.form = this._fb.group({
      email: [this.gift.email, [<any>Validators.required, <any>Validators.pattern('^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$')]],
      password: ['']
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.gift.email = value.email;
    });

  }

}
