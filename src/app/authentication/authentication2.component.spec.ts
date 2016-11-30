import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthenticationComponent } from './authentication.component';
import { CheckGuestEmailService } from '../../app/services/check-guest-email.service';
import { CookieService } from 'angular2-cookie/core';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GiftService } from '../services/gift.service';
import { HttpClientService } from '../services/http-client.service';
import { LoginService } from '../services/login.service';
import { StateManagerService } from '../services/state-manager.service';


fdescribe('AuthenticationComponent', () => {
  let form: any;
  
  let fixture: AuthenticationComponent,
      router: Router,
      stateManagerService: StateManagerService,
      gift: GiftService,
      _fb: FormBuilder,
      checkGuestEmailService: CheckGuestEmailService,
      loginService: LoginService,
      httpClientService: HttpClientService,
      existingPaymentInfoService: ExistingPaymentInfoService;

  beforeEach(() => {

    router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    stateManagerService = jasmine.createSpyObj<StateManagerService>('stateManagerService', ['getNextPageToShow']);
    gift = jasmine.createSpyObj<GiftService>('giftService', ['resetPaymentDetails']);
    _fb = new FormBuilder();
    spyOn(_fb, 'group').and.returnValue
    checkGuestEmailService = jasmine.createSpyObj<CheckGuestEmailService>('checkGuestEmailService', ['guestEmailExists']);
    loginService = jasmine.createSpyObj<LoginService>('loginService', ['login']);
    httpClientService = jasmine.createSpyObj<HttpClientService>('httpClientService', ['get']);
    existingPaymentInfoService = jasmine.createSpyObj<ExistingPaymentInfoService>('existingPaymentInfoService', ['resolve']);

    fixture = new AuthenticationComponent(router, stateManagerService, gift, _fb, checkGuestEmailService, loginService, httpClientService, existingPaymentInfoService);
    fixture.form = new FormGroup({
      email: new FormControl('good@', Validators.minLength(8)),
      password: new FormControl('foobar')
    })
  });

  describe('#ngOnInit', () => {
    it('initializes the component', () => {
      expect(fixture).toBeTruthy();
    });
  });

  describe('#back', () => {});

  describe('#adv', () => {});

  describe('#next', () => {
    it('does not get called if form is invalid', () => {
      spyOn(fixture, 'adv');
      fixture.next();
      expect(fixture.adv).not.toHaveBeenCalled();
    });

    it('calls #adv when valid auth credentials are provided', () => {
    
    });

    it('provides an error message when invalid auth credentials are provided', () => {
    
    });
  });

  describe('#guest', () => {});

  describe('#checkEmail', () => {});
});
