import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LoginService {

  private baseUrl = 'https://gatewayint.crossroads.net:443/gateway/api/';
  private loginUrl = this.baseUrl + 'Login';

  constructor(private http: Http ) { }

  login(email: string, password: string): Observable<any> {
    let body = {
      'username': email,
      'password': password
    };

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.loginUrl, body, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(res: Response | any) {
    return [res.json()];
  }

}
