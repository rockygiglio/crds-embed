
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



describe('Component: Authentication', () => {
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
                                                                                            'hidePage',
                                                                                            'setLoading']);
    gift = jasmine.createSpyObj<GiftService>('giftService', ['loadUserData', 'validateRoute']);
    _fb = new FormBuilder();
    checkGuestEmailService = jasmine.createSpyObj<CheckGuestEmailService>('checkGuestEmailService', ['guestEmailExists']);
    loginService = jasmine.createSpyObj<LoginService>('loginService', ['login']);
    httpClientService = jasmine.createSpyObj<HttpClientService>('httpClientService', ['get']);
    existingPaymentInfoService = jasmine.createSpyObj<ExistingPaymentInfoService>('existingPaymentInfoService', ['resolve']);

    fixture = new AuthenticationComponent(router, stateManagerService, gift, _fb,
                                          checkGuestEmailService, loginService, httpClientService,
                                          existingPaymentInfoService);
    fixture.ngOnInit();
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
    it('should call the router to move to the next step', () => {
      fixture.adv();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('#back', () => {
    it('should call the router to move to the previous step', () => {
      fixture.back();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('#submitGuest', () => {

    it('should not process if form is invalid', () => {
      fixture.submitGuest();
      expect(fixture.formGuest.valid).toBe(false);
    });

    it('should process if form is valid', () => {
      fixture.formGuest.setValue({ email: 's@s.com' });
      (<jasmine.Spy>checkGuestEmailService.guestEmailExists).and.returnValue(Observable.of({}));
      fixture.submitGuest();
      expect(fixture.formGuest.valid).toBe(true);
    });

    it('should throw error if email address is used', () => {
      fixture.formGuest.setValue({ email: 's@s.com' });
      (<jasmine.Spy>checkGuestEmailService.guestEmailExists).and.returnValue(Observable.of(true));
      fixture.submitGuest();
      expect(fixture.guestEmail).toBe(true);
    });

    it('should process if email address is not used', () => {
      fixture.formGuest.setValue({ email: 's@s.com' });
      (<jasmine.Spy>checkGuestEmailService.guestEmailExists).and.returnValue(Observable.of(false));
      fixture.submitGuest();
      expect(fixture.guestEmail).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalled();
    });

  });

  it('#formInvalid(field) should check to see if field is invalid', () => {

    fixture.form.setValue({ email: 's@s.com', password: 'test' });
    let isInvalid = fixture.formInvalid('email');
    expect(isInvalid).toBe(false);

    fixture.form.setValue({ email: 'sm', password: 'test' });
    isInvalid = fixture.formInvalid('email');
    expect(isInvalid).toBe(true);

  });

  describe('#formatErrorMessage', () => {
    it('should return <u>required</u> when errors.required !== undefined', () => {
      let errors = { required: true };

      let res = fixture.formatErrorMessage(errors);
      expect(res).toBe('is <u>required</u>');
    });

    it('should return <em>invalid</em> when errors.required === undefined', () => {
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

      it('should not call #adv', () => {
        spyOn(fixture, 'adv');

        fixture.submitLogin();
        expect(fixture.adv).not.toHaveBeenCalled();
      });

      it('loginException should get set to true', () => {
        expect(fixture.loginException).toBeFalsy();
        fixture.submitLogin();
        expect(fixture.loginException).toBeTruthy();
      });
    });

    describe('when invalid credentials are submitted', () => {
      beforeEach(() => {
        setForm('bad@bad.com', 'reallynotgood');
        (<jasmine.Spy>loginService.login).and.returnValue(Observable.throw({}));
      });

      it('#adv should not get called', () => {
        spyOn(fixture, 'adv');

        fixture.submitLogin();
        expect(fixture.adv).not.toHaveBeenCalled();
      });

      it('loginException should get set to true', () => {
        expect(fixture.loginException).toBeFalsy();
        fixture.submitLogin();
        expect(fixture.loginException).toBeTruthy();
      });
    });

    it('should call #adv when valid auth credentials are submitted', () => {
      setForm('good@good.com', 'foobar');
      (<jasmine.Spy>loginService.login).and.returnValue(Observable.of({}));
      spyOn(fixture, 'adv');

      fixture.submitLogin();
      expect(fixture.adv).toHaveBeenCalled();
    });

    it('should provide an error message', () => {
      setForm('bad@bad.com', 'reallynotgood');
      (<jasmine.Spy>loginService.login).and.returnValue(Observable.throw({}));
      spyOn(fixture, 'adv');

      expect(fixture.loginException).toBeFalsy();
      fixture.submitLogin();
      expect(fixture.loginException).toBeTruthy();
    });
  });
});
