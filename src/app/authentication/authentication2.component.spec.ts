import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthenticationComponent } from './authentication.component';
import { CheckGuestEmailService } from '../../app/services/check-guest-email.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GiftService } from '../services/gift.service';
import { HttpClientService } from '../services/http-client.service';
import { LoginService } from '../services/login.service';
import { StateManagerService } from '../services/state-manager.service';



describe('AuthenticationComponent', () => {
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
    stateManagerService = jasmine.createSpyObj<StateManagerService>('stateManagerService', ['getNextPageToShow',
                                                                                            'getPrevPageToShow',
                                                                                            'hidePage']);
    gift = jasmine.createSpyObj<GiftService>('giftService', ['loadUserData']);
    _fb = new FormBuilder();
    checkGuestEmailService = jasmine.createSpyObj<CheckGuestEmailService>('checkGuestEmailService', ['guestEmailExists']);
    loginService = jasmine.createSpyObj<LoginService>('loginService', ['login']);
    httpClientService = jasmine.createSpyObj<HttpClientService>('httpClientService', ['get']);
    existingPaymentInfoService = jasmine.createSpyObj<ExistingPaymentInfoService>('existingPaymentInfoService', ['resolve']);

    fixture = new AuthenticationComponent(router, stateManagerService, gift, _fb,
                                          checkGuestEmailService, loginService, httpClientService,
                                          existingPaymentInfoService);
  });

  function setForm( email, password ) {
    fixture.form = new FormGroup({
      email: new FormControl(email, Validators.minLength(8)),
      password: new FormControl(password)
    });
  }

  describe('#ngOnInit', () => {
    it('initializes the component', () => {
      expect(fixture).toBeTruthy();
    });
  });

  describe('#adv', () => {
    it('calls the router to move to the next step', () => {
      fixture.adv();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('#back', () => {
    it('calls the router to move to the previous step', () => {
      fixture.back();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('#checkEmail', () => {});

  xit('formInvalid(field) check to see if field is invalid', () => {});

  describe('#formatErrorMessage', () => {
    it('returns <u>required</u> when errors.required !== undefined', () => {
      let errors = { required: true };

      let res = fixture.formatErrorMessage(errors);
      expect(res).toBe('is <u>required</u>');
    });

    it('returns <em>invalid</em> when errors.required === undefined', () => {
      let errors = { require: undefined };

      let res = fixture.formatErrorMessage(errors);
      expect(res).toBe('is <em>invalid</em>');
    });
  });

  describe('#next', () => {
    describe('when form is invalid', () => {
      beforeEach(() => {
        setForm('good@', 'foobar');
      });

      it('does not call #adv', () => {
        spyOn(fixture, 'adv');

        fixture.next();
        expect(fixture.adv).not.toHaveBeenCalled();
      });

      it('loginException gets set to true', () => {
        expect(fixture.loginException).toBeFalsy();
        fixture.next();
        expect(fixture.loginException).toBeTruthy();
      });
    });

    describe('when invalid credentials are submitted', () => {
      beforeEach(() => {
        setForm('bad@bad.com', 'reallynotgood');
        (<jasmine.Spy>loginService.login).and.returnValue(Observable.throw({}));
      });

      it('#adv does not get called', () => {
        spyOn(fixture, 'adv');

        fixture.next();
        expect(fixture.adv).not.toHaveBeenCalled();
      });

      it('loginException gets set to true', () => {
        expect(fixture.loginException).toBeFalsy();
        fixture.next();
        expect(fixture.loginException).toBeTruthy();
      });
    });

    it('calls #adv when valid auth credentials are submitted', () => {
      setForm('good@good.com', 'foobar');
      (<jasmine.Spy>loginService.login).and.returnValue(Observable.of({}));
      spyOn(fixture, 'adv');

      fixture.next();
      expect(fixture.adv).toHaveBeenCalled();
    });
  });
 });
