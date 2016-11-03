import { Injectable } from '@angular/core';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

@Injectable()
export class UserSessionService {

  private readonly accessToken: string = process.env.CRDS_ENV + 'sessionId';
  private readonly refreshToken: string = process.env.CRDS_ENV + 'refreshToken';
  private cookieOptions: CookieOptionsArgs;

  constructor(private cookieService: CookieService) {
    this.cookieOptions = { domain: '.crossroads.net' };
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get(this.accessToken);
  }

  logOut(): void {
    this.cookieService.remove(this.accessToken);
    this.cookieService.remove(this.refreshToken);
  }

  getAccessToken(): string {
    return this.cookieService.get(this.accessToken);
  }

  getRefreshToken(): string {
    return this.cookieService.get(this.refreshToken);
  }

  setAccessToken(value: string): void {
    this.cookieService.put(this.accessToken, value, this.cookieOptions);
  }

  setRefreshToken(value: string): void {
    this.cookieService.put(this.refreshToken, value, this.cookieOptions);
  }
}
