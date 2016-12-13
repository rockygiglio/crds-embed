import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PaymentService } from '../services/payment.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  public errorMessage: string = '';
  public submitted: boolean = false;
  public regForm: FormGroup;
  public duplicateUser: boolean = false;
  private termsOfServiceUrl: string;
  private privacyPolicyUrl: string;
  private forgotPasswordUrl: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private state: StateService,
    private paymentService: PaymentService,
    private store: StoreService
  ) {
    const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
    this.regForm = this.fb.group({
      firstName: ['', [<any>Validators.required]],
      lastName:  ['', [<any>Validators.required]],
      email:     ['', [<any>Validators.required, <any>Validators.pattern(emailRegex)]],
      password:  ['', [<any>Validators.required, <any>Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.privacyPolicyUrl = `//${process.env.CRDS_ENV}.crossroads.net/privacypolicy`;
    this.forgotPasswordUrl = `//${process.env.CRDS_ENV}.crossroads.net/forgot-password`;
    this.termsOfServiceUrl = `//${process.env.CRDS_ENV}.crossroads.net/terms-of-service`;

    this.state.setLoading(false);
  }

  back(): boolean {
    this.router.navigateByUrl(this.state.getPage(this.state.authenticationIndex));
    return false;
  }

  adv(): void {
    this.router.navigateByUrl(this.state.getNextPageToShow(this.state.registrationIndex));
  }

  submitRegistration() {
    this.submitted = true;
    if ( this.regForm.valid ) {
      this.state.setLoading(true);
      let newUser = new User(
        this.regForm.get('firstName').value,
        this.regForm.get('lastName').value,
        this.regForm.get('email').value,
        this.regForm.get('password').value
      );
      this.paymentService.postUser(newUser).subscribe(
        user => {
          if (!this.paymentService.isLoggedIn()) {
            this.loginNewUser(newUser.email, newUser.password);
          }
          this.adv();
        },
        error => {
          if (error === 'Duplicate User') {
            this.state.setLoading(false);
            this.duplicateUser = true;
          }
        }
      );
    }

    this.submitted = true;
    return false;
  }

  loginNewUser(email, password) {
    this.paymentService.postLogin(email, password)
      .subscribe(
        (user) => this.store.loadUserData(),
        (error) => this.state.setLoading(false)
      );
  }

  switchMessage(errors: any): string {
    let ret = `is <em>invalid</em>`;
    if ( errors.required !==  undefined ) {
      ret = `is <u>required</u>`;
    }
    return ret;
  }

}
