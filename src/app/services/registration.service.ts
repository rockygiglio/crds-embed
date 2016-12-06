import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import { CrdsUser } from '../models/crds-user';


@Injectable()
export class RegistrationService {

    private baseUrl = process.env.CRDS_API_ENDPOINT ;

    constructor (private httpClient: HttpClientService) {}

    postUser(user: CrdsUser): Observable<any> {

        let url: string = this.baseUrl + 'api/user';

        let a = this.httpClient.post(url, user)
            .catch(this.handleError);

        console.log(a);

        return a;
    };

    private handleError (res: Response) {
       return Observable.throw(res.json().message);
    };
}
