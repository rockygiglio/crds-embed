import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { Program } from '../interfaces/program';

export interface Program {
  Name: string;
  ProgramId: number;
  ProgramType: number;
  AllowRecurringGiving: boolean;
}

@Injectable()
export class DonationFundService implements Resolve<any> {

  private fundsUrl = process.env.CRDS_API_ENDPOINT + 'api/programs/1';

  constructor(private http: Http) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.getFunds();
  }

  getFunds(): Observable<any> {
    return this.http.get(this.fundsUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUrlParamFundOrDefault(paramFundId: number, funds: Array<Program>, defaultFund: Program): Program {
    let urlParamFund: any = funds.find(fund => Number(fund.ProgramId) === Number(paramFundId));
    let fund: Program = urlParamFund ? urlParamFund : defaultFund;
    console.log('Fund set via param or default fund: ' + fund.ProgramId);  // console log added to validate AC for US5625
    return fund;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(res: Response | any) {
    return [[{
      'ProgramId': 3,
      'Name': 'General Giving',
      'ProgramType': 1,
      'AllowRecurringGiving': true
    }]];
  }

}
