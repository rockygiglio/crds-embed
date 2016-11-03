import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class CheckGuestEmailService {

    constructor (private http: Http) {}

    guestEmailExists(email: string) {
        let findUserURL = `${process.env.EMBED_API_ENDPOINT}lookup/0/find/?email=${email}`;

        return this.http.get(findUserURL)
            .map(this.success)
            .catch(this.failure);
    }

    private success(res: Response) {
      return false;
    }

    private failure(res: Response | any) {
      return [true];
    }
}
