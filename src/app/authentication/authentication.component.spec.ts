/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AuthenticationComponent } from './authentication.component';
import { GiftService } from '../services/gift.service';
import { CheckGuestEmailService } from '../../app/services/check-guest-email.service';
import { LoginService } from '../services/login.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { FormBuilder } from '@angular/forms';
import { HttpClientService } from '../services/http-client.service';
import { CookieService } from 'angular2-cookie/core';
import { StateManagerService } from '../services/state-manager.service';

class MockStore { public subscribe() {}; }
class MockLoginService { public login() {}; }
class MockGiftService { }

describe('Component: Authentication', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        TabsModule,
        ButtonsModule,
        HttpModule
      ],
      providers:    [
        { provide: LoginService, useClass: MockLoginService},
        { provide: GiftService, useClass: MockGiftService},
        FormBuilder, CheckGuestEmailService,
        ExistingPaymentInfoService, HttpClientService,
        CookieService, StateManagerService
      ]
    });
    this.fixture = TestBed.createComponent(AuthenticationComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
