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

        let body = {
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email' : user.email,
            'password' : user.password
        };

        return this.httpClient.post(url, body)
            .catch(this.handleError);
    };

    //private extractData(res: Response) {
    //    let body = res.json();
    //    return body || { };
    //}

    private handleError (res: Response | any) {
       return [res.json()];
    };
}
