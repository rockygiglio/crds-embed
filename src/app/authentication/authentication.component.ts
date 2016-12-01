import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CheckGuestEmailService } from '../services/check-guest-email.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { GiftService } from '../services/gift.service';
import { HttpClientService } from '../services/http-client.service';
import { LoginService } from '../services/login.service';
import { StateManagerService } from '../services/state-manager.service';

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
    private httpClientService: HttpClientService,
    private existingPaymentInfoService: ExistingPaymentInfoService,
  ) { }

  ngOnInit(): void {

    if ( this.gift.isGuest === true ) {
      this.signinOption = 'Guest';
      this.email = this.gift.email;
    }

    this.form = this._fb.group({
      email: [this.gift.email, [<any>Validators.required, <any>Validators.pattern('^[a-zA-Z0-9\.\+]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$')]],
      password: ['']
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.gift.email = value.email;
    });

    if (!this.gift.type) {
      this.stateManagerService.is_loading = true;
      this.router.navigateByUrl('/payment');
    }

    this.stateManagerService.is_loading = false;
  }

  back(): boolean {
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.authenticationIndex));
    return false;
  }

  adv(): void {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.authenticationIndex));
  }

  next(): boolean {
    this.gift.isGuest = false;
    if (this.form.valid) {
      this.loginService.login(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        user => {
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

  checkEmail(): void {
    if ( this.form.valid ) {
      this.gift.isGuest = true;
      this.stateManagerService.is_loading = true;
      this.checkGuestEmailService.guestEmailExists(this.email).subscribe(
        resp => {
          this.guestEmail = resp;
          if ( resp === false ) {
            this.gift.email = this.email;
            this.adv();
          } else {
            this.stateManagerService.is_loading = false;
          }
        }
      );
    }
  }

}
