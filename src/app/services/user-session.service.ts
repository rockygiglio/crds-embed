import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from './http-client.service';

@Injectable()
export class UserSessionService {

  private readonly accessToken: string = 'sessionId';
  private readonly refreshToken: string = 'refreshToken';

  private baseUrl = 'https://gatewayint.crossroads.net:443/gateway/api/';
  private loginUrl = this.baseUrl + 'Login';

  constructor(private http: HttpClientService, private cookieService: CookieService) { }

  getAccessToken(): string {
    return this.cookieService.get('sessionId');
  }

  getRefreshToken(): string {
    return this.cookieService.get('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get(this.accessToken);
  }

  login(email: string, password: string): Observable<any> {
    let body = {
      'username': email,
      'password': password
    };

    return this.http.post(this.loginUrl, body)
      .catch(this.handleError);
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

  private handleError(res: Response | any) {
    return [res.json()];
  }

}
