import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class UserSessionService {

  private readonly accessToken: string = 'sessionId';
  private readonly refreshToken: string = 'refreshToken';

  constructor(private cookieService: CookieService) { }

  getAccessToken(): string {
    return this.cookieService.get(this.accessToken);
  }

  getRefreshToken(): string {
    return this.cookieService.get(this.refreshToken);
  }

  removeAccessToken(): void {
    this.cookieService.remove(this.accessToken);
  }

  removeRefreshToken(): void {
    this.cookieService.remove(this.refreshToken);
  }

  setAccessToken(value: string): void {
    this.cookieService.put(this.accessToken, value);
  }

  setRefreshToken(value: string): void {
    this.cookieService.put(this.refreshToken, value);
  }
}
