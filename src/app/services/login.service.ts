import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from './http-client.service';

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
      .catch(this.handleError);
  }

  private handleError(res: Response | any) {
    return [res.json()];
  }

}
