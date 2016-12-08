import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CheckGuestEmailService } from '../services/check-guest-email.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { StoreService } from '../services/store.service';
import { HttpClientService } from '../services/http-client.service';
import { LoginService } from '../services/login.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
  providers: [CheckGuestEmailService]
})
export class AuthenticationComponent implements OnInit {
  public signinOption: string = 'Sign In';

  public email: string;
  public form: FormGroup;
  public formGuest: FormGroup;
  public formGuestSubmitted: boolean;
  public formSubmitted: boolean;
  public guestEmail: boolean;
  public loginException: boolean;
  public userPmtInfo: any;
  private helpUrl: string;
  private forgotPasswordUrl: string;

  constructor( private router: Router,
    private state: StateService,
    private store: StoreService,
    private _fb: FormBuilder,
    private checkGuestEmailService: CheckGuestEmailService,
    private loginService: LoginService,
    private httpClientService: HttpClientService,
    private existingPaymentInfoService: ExistingPaymentInfoService,
  ) { }

  public ngOnInit(): void {

    this.helpUrl = `//${process.env.CRDS_ENV}.crossroads.net/help`;
    this.forgotPasswordUrl = `//${process.env.CRDS_ENV}.crossroads.net/forgot-password`;

    if ( this.store.isGuest === true && this.store.isOneTimeGift() === true ) {
      this.signinOption = 'Guest';
      this.email = this.store.email;
    }

    this.form = this._fb.group({
      email: [this.store.email, [<any>Validators.required, <any>Validators.pattern('^[a-zA-Z0-9\.\+]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$')]],
      password: ['', <any>Validators.required]
    });

    this.formGuest = this._fb.group({
      email: [this.store.email, [<any>Validators.required, <any>Validators.pattern('^[a-zA-Z0-9\.\+]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$')]]
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.store.email = value.email;
    });

    this.store.validateRoute(this.router);
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
      this.store.isGuest = true;
      this.state.setLoading(true);
      this.checkGuestEmailService.guestEmailExists(this.email).subscribe(
        resp => {
          this.guestEmail = resp;
          if ( resp === false ) {
            this.store.email = this.email;
            this.adv();
          } else {
            this.state.setLoading(false);
          }
        }
      );
    }
  }

  public submitLogin(): boolean {
    this.formSubmitted = true;
    this.store.isGuest = false;
    this.state.setLoading(true);
    this.loginException = false;
    if (this.form.valid) {
      this.loginService.login(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        (user) => {
          this.store.loadUserData();
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
