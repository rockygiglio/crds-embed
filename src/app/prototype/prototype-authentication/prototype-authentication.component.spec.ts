/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsModule } from 'ng2-bootstrap/ng2-bootstrap';

import { PrototypeAuthenticationComponent } from './prototype-authentication.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';
import { CheckGuestEmailService } from '../../../app/services/check-guest-email.service';
import { LoginService } from '../../services/login.service';
import { UserSessionService } from '../../services/user-session.service';
import { FormBuilder } from '@angular/forms';

class MockPrototypeStore { public subscribe() {}; }

class MockLoginService { public login() {}; }

describe('Component: PrototypeAuthentication', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeAuthenticationComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        TabsModule,
        HttpModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        { provide: LoginService, useClass: MockLoginService},
        PrototypeGiftService, FormBuilder, CheckGuestEmailService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeAuthenticationComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
