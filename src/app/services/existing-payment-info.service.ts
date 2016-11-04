import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ExistingPaymentInfoService {

  private baseUrl           = process.env.CRDS_API_ENDPOINT + 'api/';
  private loginUrl          = this.baseUrl + 'login';
  private getPreviousPmtUrl = this.baseUrl + 'donor/?email=';

  private testUserAcct = {
    username: 'scrudgemcduckcrds@mailinator.com',
    password: 'madmoneyyall'
  };

  constructor(private http: Http) {}

  getTestUser(): Observable<any[]> {
    return this.http.post(this.loginUrl, this.testUserAcct)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getExistingPaymentInfo(userToken: string): Observable<any[]> {

    let headers = new Headers({'Accept': 'application/json'});
    headers.append('Authorization', `${userToken}`);

    let options = new RequestOptions({headers: headers});

    return this.http.get(this.getPreviousPmtUrl, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(res: Response | any): any[] {
    return [[]];
  }
}
