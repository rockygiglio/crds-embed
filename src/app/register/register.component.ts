import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public errorMessage: string = '';
  public submitted: boolean = false;
  regForm: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private stateManagerService: StateManagerService,
              private loginService: LoginService) {

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
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.registrationIndex));
    return false;
  }

  next() {
    this.submitted = true;
    if ( this.regForm.valid ) {
      this.stateManagerService.is_loading = true;
      const theurl = this.stateManagerService.getNextPageToShow(this.stateManagerService.registrationIndex);
      this.router.navigateByUrl(theurl);
    }

    this.submitted = true;
    return false;
  }

  switchMessage(errors: any): string {
    let ret = `is <em>invalid</em>`;
    if ( errors.required !==  undefined ) {
      ret = `is <u>required</u>`;
    }
    return ret;
  }

}
