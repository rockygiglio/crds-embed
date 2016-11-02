import * as _ from 'lodash';

export class PrototypeGiftService {
  product_name: string = 'Summer Camp 2017';
  flow_type: string = 'gift';
  amount: number;
  predefined_amount: number;
  custom_amount: number;
  fund: string = 'I\'m In';
  frequency: string = 'One Time';
  payment_type: string;
  account_type: string = 'personal';
  account_name: string;
  routing_number: string;
  ach_account_number: string;
  cc_account_number: string;
  exp_date: string;
  cvv: string;
  zip_code: string;
  start_date: string;
  email: string;
  is_guest: boolean = false;
  init: boolean = true;

  reset() {
    _.each([
      'email',
      'amount',
    ], (f: any) => {
      delete(this[f]);
    });
    this.resetDate();
    this.resetPaymentDetails();
  }

  resetDate() {
    this.start_date = undefined;
    return false;
  }

  resetPaymentDetails() {
    _.each([
      'payment_type',
      'account_type',
      'account_name',
      'routing_number',
      'ach_account_number',
      'cc_account_number',
      'exp_date',
      'cvv',
      'zip_code'
    ], (f: any) => {
      delete(this[f]);
    });
  }

  accountNumber() {
    try {
      return this.payment_type === 'cc' ? this.cc_account_number.toString() : this.ach_account_number.toString();
    } catch (event) {
      return undefined;
    }
  }
}
