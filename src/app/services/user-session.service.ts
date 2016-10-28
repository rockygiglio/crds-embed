import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class UserSessionService {

  readonly accessToken: string = 'sessionId';
  readonly refreshToken: string = 'refreshToken';

  constructor(private cookieService: CookieService) { 
    console.log('blah blah');
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get(this.accessToken);
  }

  logOut(): void {
    this.cookieService.remove(this.accessToken);
    this.cookieService.remove(this.refreshToken);
  }

  setAccessToken(value: string): void {
    this.cookieService.put('sessionId', value);
  }

  setRefreshToken(value: string): void {
    this.cookieService.put('refreshToken', value);
  }

  getAccessToken(): string {
    return this.cookieService.get('sessionId');
  }

  getRefreshToken(): string {
    return this.cookieService.get('refreshToken');
  }

}
