/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserSessionService } from './user-session.service';
import { CookieService } from 'angular2-cookie/core';

describe('Service: UserSession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSessionService, CookieService]
    });
  });

  it('should create an instance', inject([UserSessionService], (service: UserSessionService) => {
    expect(service).toBeTruthy();
  }));

  it('should set access token', inject([UserSessionService], (service: UserSessionService) => {
    let accessToken = 'qwertyuio1234567890';
    service.setAccessToken(accessToken);
    expect(service.getAccessToken()).toBe(accessToken);
  }));

  it('should set refresh token', inject([UserSessionService], (service: UserSessionService) => {
    let refreshToken = 'zxcvbnm97654123';
    service.setRefreshToken(refreshToken);
    expect(service.getRefreshToken()).toBe(refreshToken);
  }));

  it('should check if user is logged in', inject([UserSessionService], (service: UserSessionService) => {
    let accessToken = 'qwertyuio1234567890';
    service.setAccessToken(accessToken);
    expect(service.isLoggedIn()).toBeTruthy();
  }));

  it('should log a user out', inject([UserSessionService], (service: UserSessionService) => {
    let accessToken = 'qwertyuio1234567890';
    service.setAccessToken(accessToken);
    service.logOut();
    expect(service.isLoggedIn()).toBeFalsy();
  }));

});
