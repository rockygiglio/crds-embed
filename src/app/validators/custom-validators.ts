import { AbstractControl, Validators } from '@angular/forms';

export class CustomValidators {
  static creditCard(control: AbstractControl): any {
    if (Validators.required(control) !== undefined && Validators.required(control) !== null) {
      return null;
    }

    let sanitized: string = control.value.toString().replace(/[^0-9]+/g, '');

    // problem with chrome
    let ccRegex = new RegExp(['!(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])',
                           '[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|',
                           '(?:2131|1800|35\d{3})\d{11})$/'].join(''));
    if (ccRegex.test(sanitized)) {
      return {'creditCard': true};
    }

    let sum = 0;
    let digit;
    let tmpNum;
    let shouldDouble;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      digit = sanitized.substring(i, (i + 1));
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        if (tmpNum >= 10) {
          sum += ((tmpNum % 10) + 1);
        } else {
          sum += tmpNum;
        }
      } else {
        sum += tmpNum;
      }
      shouldDouble = !shouldDouble;
    }

    if (Boolean((sum % 10) === 0 ? sanitized : false)) {
      return null;
    }

    return {'creditCard': true};
  }

  static expirationDate(control: AbstractControl): any {
    if (Validators.required(control) !== undefined && Validators.required(control) !== null) {
      return null;
    }

    let expire: string = control.value;
    let month: number;
    let year: number;
    let result: any = false;

    if (expire.length > 0) {
      if (expire.length < 4) {
        return { 'minLength': true };
      }

      if (expire.length === 4) {
        month = parseInt(expire.substr(0, 2), 10);
        year  = parseInt(expire.substr(2, 2), 10);
      } else if (expire.length === 5) {
        month = parseInt(expire.substr(0, 2), 10);
        year  = parseInt(expire.substr(3, 2), 10);
      }

      if (isNaN(month) || isNaN(year)) {
        result = false;
      }

      if (month < 1 || month > 12) {
        result = false;
      }

      if (year < 0 || year > 99) {
        result = false;
      }

      let date: Date       = new Date();
      let curMonth: number = date.getMonth();
      let curYear: number  = parseInt( date.getFullYear().toString().substr(2, 2), 10 );

      if (year < curYear) {
        result = false;
      } else if (year === curYear) {
        result = month >= curMonth;
      } else {
        result =  true;
      }

      if (result) {
        result = { 'expirationDate': true };
      }
    }

    return result;
  }
}
