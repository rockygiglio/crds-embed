import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class FindUserService {

    constructor (private http: Http) {}

    getUserByEmail(email: string): Observable<any> {
        let baseUrl = '//localhost:49380/',
            findUserURL = `${baseUrl}api/lookup/0/find/?email=${email}`;

        return this.http.get(findUserURL)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (res: Response | any) {
        console.log('Call for find user by email failed');
    }
}