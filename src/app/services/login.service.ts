import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';

@Injectable()
export class LoginService {

  private baseUrl = 'https://gatewayint.crossroads.net:443/gateway/api/';
  private loginUrl = this.baseUrl + 'Login';

  constructor(private http: HttpClientService, private userSession: UserSessionService ) { }

  isLoggedIn(): boolean {
    return !!this.userSession.getAccessToken();
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
    this.userSession.removeAccessToken();
    this.userSession.removeRefreshToken();
  }

  private handleError(res: Response | any) {
    return [res.json()];
  }

}
