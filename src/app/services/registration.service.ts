import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';

@Injectable()
export class RegistrationService {
    private baseUrl = process.env.CRDS_API_ENDPOINT ;

    constructor (private httpClient: HttpClientService) {}

    postUser(user: User): Observable<any> {
        let url: string = this.baseUrl + 'api/user';
        return this.httpClient.post(url, user)
            .catch(this.handleError);
    };

    private handleError (res: Response) {
       return Observable.throw(res.json().message);
    };
}
