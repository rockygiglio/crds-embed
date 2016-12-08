
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { RegisterComponent } from './register.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { StateService } from '../services/state.service';
import { LoginService } from '../services/login.service';
import { StoreService } from '../services/store.service';

describe('Component: Registration', () => {
  let fixture: RegisterComponent,
      router: Router,
      _fb: FormBuilder,
      stateManagerService: StateService,
      loginService: LoginService,
      registrationService: RegistrationService,
      store: StoreService;

  beforeEach(() => {

    router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    stateManagerService = jasmine.createSpyObj<StateService>('stateManagerService', ['getNextPageToShow',
                                                                                            'getPrevPageToShow',
                                                                                            'hidePage',
                                                                                            'setLoading']);
    _fb = new FormBuilder();
    loginService = jasmine.createSpyObj<LoginService>('loginService', ['login']);
    registrationService = jasmine.createSpyObj<RegistrationService>('registrationService', ['postUser']);

    fixture = new RegisterComponent(router, _fb, stateManagerService, loginService, registrationService, store);
    fixture.ngOnInit();
  });

  function setForm( firstName, lastName, email, password ) {
    fixture.regForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastname: new FormControl(lastName, Validators.required),
      email: new FormControl(email, Validators.required),
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


  describe('#submit User', () => {

    it('should not process if form is invalid', () => {
      let didSubmit = fixture.submitRegistration();
      expect(didSubmit).toBe(false);
    });
  });


  describe('#formatErrorMessage', () => {
    it('should return <u>required</u> when errors.required !== undefined', () => {
      let errors = { required: true };

      let res = fixture.switchMessage(errors);
      expect(res).toBe('is <u>required</u>');
    });

    it('should return <em>invalid</em> when errors.required === undefined', () => {
      let errors = { require: undefined };

      let res = fixture.switchMessage(errors);
      expect(res).toBe('is <em>invalid</em>');
    });
  });

  describe('#next', () => {
    describe('when form is invalid', () => {
      beforeEach(() => {
        setForm('Bob', '', 'good@g.com', 'foobar');
      });

      it('should not call #adv', () => {
        spyOn(fixture, 'adv');

        fixture.submitRegistration();
        expect(fixture.adv).not.toHaveBeenCalled();
      });
    });

    describe('when invalid credentials are submitted', () => {
      beforeEach(() => {
        setForm('Bob', '', 'good@g.com', 'foobar');
        (<jasmine.Spy>loginService.login).and.returnValue(Observable.throw({}));
      });

      it('#adv should not get called', () => {
        spyOn(fixture, 'adv');
      });
    });

  });
});
