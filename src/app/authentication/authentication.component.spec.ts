import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { APIService } from '../services/api.service';
import { ContentService } from '../services/content.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

import { AuthenticationComponent } from './authentication.component';

describe('Component: Authentication', () => {

  let fixture: AuthenticationComponent,
      router: Router,
      stateService: StateService,
      store: StoreService,
      fb: FormBuilder,
      api: APIService,
      validation: ValidationService,
      content: ContentService;

  beforeEach(() => {

    api = jasmine.createSpyObj<APIService>('api', ['getRegisteredUser', 'postLogin']);
    content = jasmine.createSpyObj<ContentService>('content', ['loadData', 'getContent']);
    fb = new FormBuilder();
    router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    stateService = jasmine.createSpyObj<StateService>(
      'stateService',
      [
        'getNextPageToShow',
        'getPrevPageToShow',
        'hidePage',
        'setLoading'
      ]
    );
    store = jasmine.createSpyObj<StoreService>(
      'store', [
        'loadUserData',
        'validateRoute',
        'dynamicData',
        'dynamicDatas'
      ]
    );
    store.content = content;
    validation = new ValidationService();
    fixture = new AuthenticationComponent(
      api,
      fb,
      router,
      stateService,
      store,
      validation
    );
    fixture.ngOnInit();
  });

  function setForm( email, password ) {
    fixture.form.setValue({ email: email, password: password});
  }

  function setGuestForm( email ) {
    fixture.formGuest.setValue({ email: email });
    fixture.email = email;
  }

  describe('#ngOnInit', () => {
    it('should initialize the component', () => {
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

    describe('when email address is invalid', () => {
      function setGuestEmailExists(state: any): void {
        (<jasmine.Spy>api.getRegisteredUser).and.returnValue(Observable.of(state));
      }

      it('should not allow space on left of @', () => {
        setGuestForm( 'p dog@s.com' );
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(false);
      });

      it('should not allow trailing space', () => {
        setGuestForm( 'pdog@smog.com ' );
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(false);
      });

      it('should not allow leading space', () => {
        setGuestForm( ' pdog@smog.com' );
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(false);
      });

      it('should require something after .', () => {
        setGuestForm( 'pdog@smog.' );
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(false);
      });

      it('should require @', () => {
        setGuestForm( 'pdogsmog.com' );
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(false);
      });

       it('should allow . in address', () => {
        setGuestForm( 'pdog.iscool@smog.com' );
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(true);
      });
    });

    describe('when form is valid', () => {
      function setGuestEmailExists(state: any): void {
        (<jasmine.Spy>api.getRegisteredUser).and.returnValue(Observable.of(state));
      }

      beforeEach(() => {
        setGuestForm( 's@s.com' );
      });

      it('formGuest.valid should be true', () => {
        setGuestEmailExists({});
        fixture.submitGuest();
        expect(fixture.formGuest.valid).toBe(true);
      });

      it('showMessage should get set to true if email guest provides exists', () => {
        setGuestEmailExists(true);
        fixture.submitGuest();
        expect(fixture.showMessage).toBe(true);
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

      describe('and user with provided email exists and existingGuestEmail is not set', () => {
        it('then existingGuestEmail should get set and adv() does not get called', () => {
          spyOn(fixture, 'adv');
          expect(fixture.existingGuestEmail).toBeUndefined();
          setGuestEmailExists(true);
          fixture.submitGuest();
          expect(fixture.existingGuestEmail).toBe('s@s.com');
          expect(fixture.adv).not.toHaveBeenCalled();
        });

        it('then buttonText should be set to `Continue Anyway`', () => {
          expect(fixture.buttonText).toBe('Next');
          setGuestEmailExists(true);
          fixture.submitGuest();
          expect(fixture.buttonText).toBe('Continue Anyway');
        });
      });

      describe('and account with provided email exists and existingGuestEmail is set', () => {
        it('then the router allows for navigation forward in the process', () => {
          spyOn(fixture, 'adv');
          expect(fixture.existingGuestEmail).toBeUndefined();
          setGuestEmailExists(true);
          fixture.submitGuest();
          expect(fixture.adv).not.toHaveBeenCalled();
          expect(fixture.existingGuestEmail).toBe('s@s.com');
          fixture.submitGuest();
          expect(fixture.adv).toHaveBeenCalled();
        });

        it('then the user can change email and continue', () => {
          spyOn(fixture, 'adv');
          expect(fixture.existingGuestEmail).toBeUndefined();
          setGuestEmailExists(true);
          fixture.submitGuest();
          expect(fixture.adv).not.toHaveBeenCalled();
          expect(fixture.existingGuestEmail).toBe('s@s.com');
          setGuestForm( 't@t.com' );
          setGuestEmailExists(false);
          fixture.submitGuest();
          expect(fixture.adv).toHaveBeenCalled();
        });
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
        (<jasmine.Spy>api.postLogin).and.returnValue(Observable.throw({}));
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

    // HACK ALERT! Once our miserable hack for pulling in add me to the map is removed or refactored
    // this test can be uncommented.
    // describe('when valid auth credentials are submitted', () => {
    //   it('should call #adv when valid auth credentials are submitted', () => {
    //     setForm('good@good.com', 'foobar');
    //     fixture.form.markAsDirty();
    //     (<jasmine.Spy>api.postLogin).and.returnValue(Observable.of({}));
    //     spyOn(fixture, 'adv');
    //     fixture.submitLogin();
    //     expect(fixture.adv).toHaveBeenCalled();
    //   });
    //});
  });
});
