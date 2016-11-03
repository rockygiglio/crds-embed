import { Injectable } from '@angular/core';

@Injectable()
export class ParamValidationService {


    constructor () {}

    isTypeValid(typeParam: any) {

        let isValidOptionString: boolean = typeParam === 'payment' || typeParam === 'donation';

        return isValidOptionString;
    }

    isInvoiceIdValid(invoiceIdParam: any, typeParam: any) {

        let isValidTypeParamReceived = this.isTypeValid(typeParam);
        let isANumber = !Number.isNaN(invoiceIdParam);
        let isGreaterThanZero = invoiceIdParam > 0;

        let isValid = isValidTypeParamReceived && isANumber && isGreaterThanZero;

        return isValid;
    }

    isTotalCostValid(totalCostParam: any, typeParam: any) {

        let isValidTypeParamReceived = this.isTypeValid(typeParam);
        let isGreaterThanZero = totalCostParam > 0;
        var isDecimal = totalCostParam.match( /^(\d+\.?\d{0,9}|\.\d{1,9})$/ );

        let isValid = isValidTypeParamReceived && isDecimal && isGreaterThanZero;

        return isValid;
    }
}
