import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  public buttonText: string = 'Next';
  public email: string;
  public form: FormGroup;
  public formGuest: FormGroup;
  public formGuestSubmitted: boolean;
  public formSubmitted: boolean;
  public guestEmail: boolean;
  public isGuestNotifiedOfExistingAccount: boolean = false;
  public loginException: boolean;
  public showMessage: boolean = false;
  public signinOption: string = 'Sign In';
  public userPmtInfo: any;

  private forgotPasswordUrl: string;
  private helpUrl: string;

  constructor(
    private api: APIService,
    private fb: FormBuilder,
    private router: Router,
    private state: StateService,
    private store: StoreService,
    private validation: ValidationService
  ) { }

  public ngOnInit(): void {
    this.helpUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/help`;
    this.forgotPasswordUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/forgot-password`;

    if ( this.store.isGuest === true && this.store.isOneTimeGift() === true ) {
      this.signinOption = 'Guest';
      this.email = this.store.email;
    }
    this.form = this.fb.group({
      email: [this.store.email, [<any>Validators.required, <any>Validators.pattern(this.validation.emailRegex)]],
      password: ['', <any>Validators.required]
    });

    this.formGuest = this.fb.group({
      email: [this.store.email, [<any>Validators.required, <any>Validators.pattern(this.validation.emailRegex)]]
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.store.email = value.email;
    });

    this.store.validateRoute(this.router);
    this.state.setLoading(false);
  }

  public resetGuestEmailFormSubmission(event) {
    if ( event.target.value !== this.store.email ) {
      this.showMessage = false;
      this.buttonText = 'Next';
      this.isGuestNotifiedOfExistingAccount = false;
    }
  }

  public showExistingEmailMessage() {
    this.guestEmail = false;
    this.showMessage = true;
    this.buttonText = 'Continue Anyway';
    this.isGuestNotifiedOfExistingAccount = true;
    this.state.setLoading(false);
  }

  public submitGuest() {
    this.formGuestSubmitted = true;
    if ( this.formGuest.valid ) {
      this.store.isGuest = true;
      this.state.setLoading(true);
      this.api.getRegisteredUser(this.email).subscribe(
        resp => {
          this.guestEmail = resp;
          if ( this.isGuestNotifiedOfExistingAccount === true || resp === false ) {
            this.store.email = this.email;
            this.adv();
          } else {
            this.showExistingEmailMessage();
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
      this.api.postLogin(this.form.get('email').value, this.form.get('password').value)
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

  public adv(): void {
    this.router.navigateByUrl(this.state.getNextPageToShow(this.state.authenticationIndex));
  }

  public back(): boolean {
    this.store.email = this.email;
    if (this.signinOption === 'Guest') {
      this.store.isGuest = true;
    }
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.authenticationIndex));
    return false;
  }

  public formInvalid(field): boolean {
    return !this.form.controls[field].valid;
  }

  public switchToSignIn() {
    this.signinOption = 'Sign In';
  }

  public hideBack() {
    if (this.store.isPayment() && this.store.amountLocked) {
      return true;
    }
    return false;
  }
}
