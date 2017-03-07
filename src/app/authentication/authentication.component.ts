import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

import { DynamicReplace } from '../models/dynamic-replace';
import { LoginRedirectService } from '../services/login-redirect.service';
import { SessionService } from '../services/session.service';


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
  public existingGuestEmail: string;
  public loginException: boolean;
  public showMessage: boolean = false;
  public signinOption: string = 'Sign In';
  public userPmtInfo: any;

  private forgotPasswordUrl: string;
  private helpUrl: string;
  private failedMessage: string = '';

  private isFinderPage: boolean = false;

  constructor(
    private api: APIService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService,
    private store: StoreService,
    private validation: ValidationService,
    private redirect: LoginRedirectService,
    private session: SessionService
  ) { }

  public ngOnInit(): void {

    try {
      let url: string = window.location.href;
      let urlAndParams: Array<string> = url.split("?");
      let params: string = urlAndParams[urlAndParams.length - 1];
      let paramsArray: Array<string> = params.split("&");
      let lastParam: string = paramsArray[paramsArray.length - 1];
      let lastParamNameValue: Array<string> = lastParam.split("=");
      let lastParamName: string = lastParamNameValue[0];
      let lastParamValue: string = lastParamNameValue[1];

      if (lastParamName === 'isfinderpage'){
        this.isFinderPage = lastParamValue == 'true';
      }
    } catch(err) {
      this.isFinderPage = false;
    }

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
    }
  }

  public showExistingEmailMessage() {
    this.guestEmail = false;
    this.showMessage = true;
    this.buttonText = 'Continue Anyway';
    this.state.setLoading(false);
  }

  public submitGuest() {
    this.formGuestSubmitted = true;
    if (this.email) {
      this.email = this.email.trim();
    }
    if ( this.formGuest.valid ) {
      this.store.isGuest = true;
      this.state.setLoading(true);
      this.api.getRegisteredUser(this.email).subscribe(
        resp => {
          this.guestEmail = resp;
         if ( this.existingGuestEmail === this.email || resp === false ) {
            this.store.email = this.email;
            this.adv();
          } else {
            this.existingGuestEmail = this.email;
            this.showExistingEmailMessage();
          }
        }
      );
    } else {
      this.formGuest.controls['email'].markAsTouched();
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
          this.session.setContactId(user.userId);
          this.store.reactiveSsoLoggedIn = true;
          this.store.loadUserData();
          this.state.hidePage(this.state.authenticationIndex);
          // HACK ALERT! This is specific to copying the add me to the map functionality
          if (this.redirect.originalTargetIsSet()){
            this.redirect.redirectToTarget(this.redirect.getOriginalTarget());
          }
          else {
            this.adv();
          }
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
