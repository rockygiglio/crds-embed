import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Program } from '../../interfaces/program';

@Injectable()
export class FundsService {

    constructor() {}

    getFundNameOrDefault(paramFundId: number, funds: Array<Program>, defaultFund: Program): string {

        let urlParamFund: any = funds.find(fund => fund.ProgramId == paramFundId);
        let urlParamFundName: any = urlParamFund ? urlParamFund.Name : undefined;
        let fundName: string = urlParamFundName ? urlParamFundName : defaultFund.Name;
        return fundName;

    }
}
