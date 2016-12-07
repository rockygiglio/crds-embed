import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RegistrationService } from '../services/registration.service';
import { CrdsUser } from '../models/crds-user';
import { GiftService } from '../services/gift.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public errorMessage: string = '';
  public submitted: boolean = false;
  regForm: FormGroup;
  public duplicateUser: boolean = false;

  constructor(private router: Router,
              private fb: FormBuilder,
              private stateManagerService: StateManagerService,
              private loginService: LoginService,
              private registrationService: RegistrationService,
              private giftService: GiftService) {

    const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
    this.regForm = this.fb.group({
        firstName: ['', [<any>Validators.required]],
        lastName:  ['', [<any>Validators.required]],
        email:     ['', [<any>Validators.required, <any>Validators.pattern(emailRegex)]],
        password:  ['', [<any>Validators.required, <any>Validators.minLength(8)]]
      });
  }

  ngOnInit() {
    this.stateManagerService.is_loading = false;
  }

  back(): boolean {
    this.router.navigateByUrl(this.stateManagerService.getPage(this.stateManagerService.authenticationIndex));
    return false;
  }

  adv(): void {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.registrationIndex));
  }

  next() {
    this.submitted = true;
    if ( this.regForm.valid ) {
      this.stateManagerService.is_loading = true;
      // register the user
      let newUser = new CrdsUser(this.regForm.get('firstName').value,
                                 this.regForm.get('lastName').value,
                                this.regForm.get('email').value,
                                 this.regForm.get('password').value);
      this.registrationService.postUser(newUser)
        .subscribe(
          user => {
            if (!this.loginService.isLoggedIn()) {
              this.loginNewUser(newUser.email, newUser.password);
            }
            this.adv();
          },
          error => {
            if (error === 'Duplicate User') {
              this.stateManagerService.is_loading = false;
              this.duplicateUser = true;
            }
          });
    }

    this.submitted = true;
    return false;
  }

  loginNewUser(email, password) {
    this.loginService.login(email, password)
      .subscribe(
        (user) => {
          this.giftService.loadUserData();
        },
        (error) => {
          this.stateManagerService.is_loading = false;
        });
  }

  emailMessage(errors: any): string {
    if (this.duplicateUser) {
      this.duplicateUser = false;
      return ('This email address is currently in use. <a href="https://www.crossroads.net/forgot-password">Forgot password.</a> ');
    }
    return 'Email ' + this.switchMessage(errors);
  }

  switchMessage(errors: any): string {
    let ret = `is <em>invalid</em>`;
    if ( errors.required !==  undefined ) {
      ret = `is <u>required</u>`;
    }
    return ret;
  }
}
