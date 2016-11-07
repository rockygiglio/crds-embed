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

  it('should create an instance', inject([UserSessionService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('should set access token', inject([UserSessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    spyOn(service.cookieService, 'put');
    service.setAccessToken(accessToken);
    expect(service.cookieService.put).toHaveBeenCalledWith(service.accessToken, accessToken, service.cookieOptions);
  }));

  it('should set refresh token', inject([UserSessionService], (service: any) => {
    let refreshToken = 'zxcvbnm97654123';
    spyOn(service.cookieService, 'put');
    service.setRefreshToken(refreshToken);
    expect(service.cookieService.put).toHaveBeenCalledWith(service.refreshToken, refreshToken, service.cookieOptions);
  }));

  it('should get access token', inject([UserSessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    spyOn(service.cookieService, 'get');
    service.getAccessToken(accessToken);
    expect(service.cookieService.get).toHaveBeenCalledWith(service.accessToken);
  }));

  it('should get refresh token', inject([UserSessionService], (service: any) => {
    let refreshToken = 'zxcvbnm97654123';
    spyOn(service.cookieService, 'get');
    service.getRefreshToken(refreshToken);
    expect(service.cookieService.get).toHaveBeenCalledWith(service.refreshToken);
  }));

  it('should check if user is logged in', inject([UserSessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    spyOn(service.cookieService, 'get').and.returnValue(accessToken);
    expect(service.isLoggedIn()).toBeTruthy();
  }));

  it('should check if user is not logged in', inject([UserSessionService], (service: any) => {
    spyOn(service.cookieService, 'get').and.returnValue(undefined);
    expect(service.isLoggedIn()).toBeFalsy();
  }));

  it('should log a user out', inject([UserSessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    service.setAccessToken(accessToken);
    service.logOut();
    expect(service.isLoggedIn()).toBeFalsy();
  }));

});
