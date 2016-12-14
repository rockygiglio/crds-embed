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
  buttonText: string = 'Next';
  public email: string;
  public form: FormGroup;
  public formGuest: FormGroup;
  public formGuestSubmitted: boolean;
  public formSubmitted: boolean;
  public guestEmail: boolean;
  public isGuestNotifiedOfExistingAccount: boolean = false;
  public loginException: boolean;
  public signinOption: string = 'Sign In';
  public userPmtInfo: any;

  private forgotPasswordUrl: string;
  private helpUrl: string;

  constructor( private router: Router,
    private state: StateManagerService,
    private gift: GiftService,
    private _fb: FormBuilder,
    private checkGuestEmailService: CheckGuestEmailService,
    private loginService: LoginService,
    private httpClientService: HttpClientService,
    private existingPaymentInfoService: ExistingPaymentInfoService,
  ) { }

  public ngOnInit(): void {

    this.helpUrl = `//${process.env.CRDS_ENV}.crossroads.net/help`;
    this.forgotPasswordUrl = `//${process.env.CRDS_ENV}.crossroads.net/forgot-password`;

    if ( this.gift.isGuest === true && this.gift.isOneTimeGift() === true ) {
      this.signinOption = 'Guest';
      this.email = this.gift.email;
    }

    let emailRegex = '[^\\.]{1,}((?!.*\\.\\.).{1,}[^\\.]{1}|)\\@[a-zA-Z0-9\-]{1,}\\.[a-zA-Z]{2,}';
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', Validators.required]
    });

    this.formGuest = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]]
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.gift.email = value.email;
    });

    this.gift.validateRoute(this.router);
    this.state.setLoading(false);
  }

  public adv(): void {
    this.router.navigateByUrl(this.state.getNextPageToShow(this.state.authenticationIndex));
  }

  public back(): boolean {
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.authenticationIndex));
    return false;
  }

  public onEnterKey() {
    let isOnLoginTab: boolean = this.signinOption === 'Sign In';

    if (isOnLoginTab) {
      this.submitLogin();
    }
  }

  public submitGuest() {
    this.formGuestSubmitted = true;
    if ( this.formGuest.valid ) {
      this.gift.isGuest = true;
      this.state.setLoading(true);
      this.checkGuestEmailService.guestEmailExists(this.email).subscribe(
        resp => {
          this.guestEmail = resp;
          if ( this.isGuestNotifiedOfExistingAccount === true || resp === false ) {
            this.gift.email = this.email;
            this.adv();
          } else {
            this.isGuestNotifiedOfExistingAccount = true;
            this.buttonText = 'Continue Anyway';
            this.state.setLoading(false);
          }
        }
      );
    }
  }

  public submitLogin(): boolean {
    this.formSubmitted = true;
    this.gift.isGuest = false;
    this.state.setLoading(true);
    this.loginException = false;
    if (this.form.valid) {
      this.loginService.login(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        (user) => {
          this.gift.loadUserData();
          this.state.hidePage(this.state.authenticationIndex);
          this.adv();
        },
        (error) => {
          this.loginException = true;
          this.state.setLoading(false);
        }
      );
    } else {
      this.loginException = true;
      this.form.controls['email'].markAsTouched();
      this.form.controls['password'].markAsTouched();
      this.state.setLoading(false);
    }
    return false;
  }

  public formInvalid(field): boolean {
    return !this.form.controls[field].valid;
  }

  public formatErrorMessage(errors: any): string {
    let ret = errors.required !== undefined ? `is <u>required</u>` : `is <em>invalid</em>`;
    return ret;
  }

  public switchToSignIn() {
    this.signinOption = 'Sign In';
  }
}
