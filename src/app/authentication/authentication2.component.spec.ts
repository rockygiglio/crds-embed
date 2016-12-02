
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
    stateManagerService = jasmine.createSpyObj<StateManagerService>('stateManagerService', ['hidePage']);
    gift = jasmine.createSpyObj<GiftService>('giftService', ['loadUserData']);
    _fb = new FormBuilder();
    spyOn(_fb, 'group').and.returnValue;
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

  describe('#back', () => {});

  describe('#adv', () => {});

  describe('#next', () => {
    it('does not get called if form is invalid', () => {
      setForm('good@', 'foobar');
      spyOn(fixture, 'adv');

      fixture.next();
      expect(fixture.adv).not.toHaveBeenCalled();
    });

    it('calls #adv when valid auth credentials are provided', () => {
      setForm('good@good.com', 'foobar');
      (<jasmine.Spy>loginService.login).and.returnValue(Observable.of({}));
      spyOn(fixture, 'adv');

      fixture.next();
      expect(fixture.adv).toHaveBeenCalled();
    });

    /*
    it('provides an error message when invalid auth credentials are provided', () => {
      setForm('bad@bad.com', 'reallynotgood');
      (<jasmine.Spy>loginService.login).and.returnValue(Observable.throw({}));
      spyOn(fixture, 'adv');

      expect(fixture.loginException).toBeFalsy();
      fixture.next();
      expect(fixture.loginException).toBeTruthy();
    });
    */

  });

  describe('#guest', () => {});

  describe('#checkEmail', () => {});
});
