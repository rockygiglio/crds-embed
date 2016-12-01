import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from './http-client.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private loginUrl = process.env.CRDS_API_ENDPOINT + 'api/login';

  constructor( private http: HttpClientService ) { }

  login(email: string, password: string): Observable<any> {
    let body = {
      'username': email,
      'password': password
    };

    return this.http.post(this.loginUrl, body)
      .map((res: Response) => {
        return res || null;
      })
      .catch(this.handleError);
  }

  isLoggedIn(): boolean {
    return this.http.hasToken();
  }

  logOut(): void {
    this.http.clearTokens();
    return;
  }

  authenticate(): Observable<any> {
    return this.http.get(process.env.CRDS_API_ENDPOINT + 'api/v1.0.0/authenticated')
      .map((res: Response) => {
        return res || null;
      })
      .catch((res: Response) => {
        return [null];
      });
  }

  public handleError(res: Response | any) {
    return Observable.throw();
  }

}
