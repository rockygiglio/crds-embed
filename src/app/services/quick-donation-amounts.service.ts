import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class QuickDonationAmountsService {

    constructor (private http: Http) {}

    private baseUrl = 'http://localhost:49380/';

    private getQuickAmtsUrl = this.baseUrl + 'api/donations/quickamounts';

    getQuickDonationAmounts(): number[] {
        return [1,2,3,4,5];
    }
}