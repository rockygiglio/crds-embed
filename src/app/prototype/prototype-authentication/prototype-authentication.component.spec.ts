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
import { CookieService } from 'angular2-cookie/core';
import { FormBuilder } from '@angular/forms';

class MockPrototypeStore { public subscribe() {}; }

describe('Component: PrototypeAuthentication', () => {

  let component: any;
  let fixture: any;

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
        PrototypeGiftService, FormBuilder, CheckGuestEmailService, LoginService, CookieService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeAuthenticationComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
