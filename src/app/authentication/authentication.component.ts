import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StateManagerService } from '../services/state-manager.service';
import { GiftService } from '../services/gift.service';
import { Router } from '@angular/router';
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

  constructor( private router: Router,
    private stateManagerService: StateManagerService,
    private gift: GiftService,
    private _fb: FormBuilder,
    private checkGuestEmailService: CheckGuestEmailService,
    private loginService: LoginService,
    private existingPaymentInfoService: ExistingPaymentInfoService,
    private userSessionService: UserSessionService
  ) { }

  back() {
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.authenticationIndex));
    return false;
  }

  adv() {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.authenticationIndex));
  }

  next() {
    if (this.form.valid) {
      this.loginService.login(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        user => {
          this.userSessionService.setUserEmail(user.userEmail);
          this.gift.loadUserData();
          this.stateManagerService.hidePage(this.stateManagerService.authenticationIndex);
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
