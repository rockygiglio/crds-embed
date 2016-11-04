import { Injectable } from '@angular/core';

@Injectable()
export class ParamValidationService {


    constructor () {}

    isTypeValid(typeParam: any) {

        let isValidOptionString: boolean = typeParam === 'payment' || typeParam === 'donation';

        return isValidOptionString;
    }

    isInvoiceIdValid(invoiceIdParam: any) {

        let isANumber: boolean = !isNaN(invoiceIdParam);
        let isGreaterThanZero: boolean = invoiceIdParam > 0;

        let isValid: boolean = isANumber && isGreaterThanZero;

        return isValid;
    }

    isTotalCostValid(totalCostParam: any) {

        let isGreaterThanZero: boolean = totalCostParam > 0;
        let isDecimal: boolean = totalCostParam.match( /^(\d+\.?\d{0,9}|\.\d{1,9})$/ );

        let isValid: boolean = isDecimal && isGreaterThanZero;

        return isValid;
    }

    isMinPaymentValid(minPaymentParam: any, totalCostParam: any) {

        let isGreaterThanZero: boolean = totalCostParam > 0;
        let isDecimal: boolean = minPaymentParam.match( /^(\d+\.?\d{0,9}|\.\d{1,9})$/ );
        let isLessThanOrEqualToTotalCost = minPaymentParam <=  totalCostParam;

        let isValid: boolean = isDecimal && isGreaterThanZero && isLessThanOrEqualToTotalCost;

        return isValid;
    }

    isTitleValid(titleParam: any) {

        let isAtLeastOneCharLong: boolean = titleParam.length > 0;
        let isValid: boolean = isAtLeastOneCharLong;

        return isValid;
    }

    isUrlValid(urlParam: any) {

        var urlRegEx: any = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var isUrlValid: boolean = urlParam.match(urlRegEx);

        let isValid: boolean = isUrlValid;

        return isValid;
    }

    isFundIdValid(fundIdParam: any) {

        let isANumber: boolean = !isNaN(fundIdParam);

        let isValid: boolean = isANumber;

        return isValid;
    }
}
