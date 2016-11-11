import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UserAuthenticationService {

  constructor(private http: HttpClientService) { }

  public login(): Observable<any> {

    return this.http.get(process.env.CRDS_API_ENDPOINT + 'api/v1.0.0/authenticated')
      .map((res: Response) => {
        return res || null;
      })
      .catch((res: Response) => {
        return [null];
      });

  }

}
