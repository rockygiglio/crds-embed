
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthenticationComponent } from './authentication.component';
import { CheckGuestEmailService } from '../../app/services/check-guest-email.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { FormBuilder } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { HttpClientService } from '../services/http-client.service';
import { LoginService } from '../services/login.service';
import { StateService } from '../services/state.service';



describe('Component: Authentication', () => {
  let fixture: AuthenticationComponent,
      router: Router,
      stateManagerService: StateService,
      store: StoreService,
      _fb: FormBuilder,
      checkGuestEmailService: CheckGuestEmailService,
      loginService: LoginService,
      httpClientService: HttpClientService,
      existingPaymentInfoService: ExistingPaymentInfoService;

  beforeEach(() => {

    router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    stateManagerService = jasmine.createSpyObj<StateService>(
      'stateManagerService',
      [
        'getNextPageToShow',
        'getPrevPageToShow',
        'hidePage',
        'setLoading'
      ]
    );
    store = jasmine.createSpyObj<StoreService>(
      'storeService', [
        'loadUserData',
        'validateRoute'
      ]
    );
    _fb = new FormBuilder();
    checkGuestEmailService = jasmine.createSpyObj<CheckGuestEmailService>('checkGuestEmailService', ['guestEmailExists']);
    loginService = jasmine.createSpyObj<LoginService>('loginService', ['login']);
    httpClientService = jasmine.createSpyObj<HttpClientService>('httpClientService', ['get']);
    existingPaymentInfoService = jasmine.createSpyObj<ExistingPaymentInfoService>('existingPaymentInfoService', ['resolve']);

    fixture = new AuthenticationComponent(
      router,
      stateManagerService,
      store,
      _fb,
      checkGuestEmailService,
      loginService
    );
    fixture.ngOnInit();
  });

  function setForm( email, password ) {
    fixture.form.setValue({ email: email, password: password});
  }

  function setGuestForm( email ) {
    fixture.formGuest.setValue({ email: email });
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
    describe('when form is invalid', () => {
      it('formGuest.valid should be false', () => {
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(false);
      });
    });

    describe('when form is valid', () => {
      function setGuestEmailExists(state: any): void {
        (<jasmine.Spy>checkGuestEmailService.guestEmailExists).and.returnValue(Observable.of(state));
      }

      beforeEach(() => {
        setGuestForm( 's@s.com' );
      });

      it('formGuest.valid should be true', () => {
        setGuestEmailExists({});
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(true);
      });

      it('guestEmail should get set to true if email guest provides exists', () => {
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.guestEmail).toBe(true);
      });

      it('guestEmail should get set to false if email guest provides does not exist', () => {
        setGuestEmailExists(false);
        fixture.submitGuest();
        expect(fixture.guestEmail).toBe(false);
      });

      it('should navigate to the next step', () => {
        setGuestEmailExists(false);
        fixture.submitGuest();
        expect(router.navigateByUrl).toHaveBeenCalled();
      });
    });
  });

  describe('#formInvalid(field)', () => {
    it('should check to see if field is valid when valid credentials are provided', () => {
      setForm('s@s.com', 'test');
      let isInvalid = fixture.formInvalid('email');
      expect(isInvalid).toBe(false);
    });

    it('should check to see if field is invalid when invalid credentials are provided', () => {
      setForm('sm', 'test');
      let isInvalid = fixture.formInvalid('email');
      expect(isInvalid).toBe(true);
    });
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
        fixture.form.markAsDirty();
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

    describe('when invalid auth credentials are submitted', () => {
      beforeEach(() => {
        setForm('bad@bad.com', 'reallynotgood');
        fixture.form.markAsDirty();
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

    describe('when valid auth credentials are submitted', () => {
      it('should call #adv when valid auth credentials are submitted', () => {
        setForm('good@good.com', 'foobar');
        fixture.form.markAsDirty();
        (<jasmine.Spy>loginService.login).and.returnValue(Observable.of({}));
        spyOn(fixture, 'adv');
        fixture.submitLogin();
        expect(fixture.adv).toHaveBeenCalled();
      });
    });
  });
});
