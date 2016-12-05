import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import { CrdsUser } from '../models/crds-user';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RegistrationService {

    private baseUrl = process.env.CRDS_API_ENDPOINT ;

    constructor (private http: Http, private httpClient: HttpClientService) {}

    postUser(user: CrdsUser): Observable<any> {

        let url: string = this.baseUrl + 'api/user';

        return this.httpClient.post(url, user)
            .map(this.extractData)
            .catch(this.handleError);
    };

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (err: Response | any) {
       return Observable.throw(err);
    };
}
