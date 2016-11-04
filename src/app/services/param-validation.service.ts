import { Injectable } from '@angular/core';

@Injectable()
export class ParamValidationService {


    constructor () {}

    isTypeValid(typeParam: any) {

        let isValidOptionString: boolean = typeParam === 'payment' || typeParam === 'donation';

        return isValidOptionString;
    }

    isInvoiceIdValid(invoiceIdParam: any, typeParam: any) {

        let isValidTypeParamReceived: boolean= this.isTypeValid(typeParam);
        let isANumber: boolean = !Number.isNaN(invoiceIdParam);
        let isGreaterThanZero: boolean = invoiceIdParam > 0;

        let isValid: boolean = isValidTypeParamReceived && isANumber && isGreaterThanZero;

        return isValid;
    }

    isTotalCostValid(totalCostParam: any, typeParam: any) {

        let isValidTypeParamReceived: boolean = this.isTypeValid(typeParam);
        let isGreaterThanZero: boolean = totalCostParam > 0;
        var isDecimal: boolean = totalCostParam.match( /^(\d+\.?\d{0,9}|\.\d{1,9})$/ );

        let isValid: boolean = isValidTypeParamReceived && isDecimal && isGreaterThanZero;

        return isValid;
    }

    isUrlValid(urlParam: any, typeParam: any) {

        var urlRegEx: any = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var isUrlValid: boolean = urlParam.match(urlRegEx);

        let isValid: boolean = isUrlValid;

        return isValid;
    }
}
