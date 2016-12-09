import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { Fund } from '../models/fund';

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

  getUrlParamFundOrDefault(paramFundId: number, funds: Array<Fund>, defaultFund: Fund): Fund {
    let urlParamFund: any = funds.find(fund => Number(fund.ID) === Number(paramFundId));
    let fund: Fund = urlParamFund ? urlParamFund : defaultFund;
    return fund;
  }

  private extractData(res: Response) {
    let body = res.json();
    let funds: Array<Fund> = new Array();
    if (Array.isArray(body) && body.length > 0) {
      for (let i = 0; i < body.length; i++) {
        funds.push(
          new Fund(
            body[i].ProgramId,
            body[i].Name,
            body[i].ProgramType,
            body[i].AllowRecurringGiving
          )
        );
      }
    }
    return funds;
  }

  public getDefaultFund() {
    return new Fund(3, 'General Giving', 1, true);
  }

  private handleError(res: Response | any) {
    return [[ this.getDefaultFund() ]];
  }

}
