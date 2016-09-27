declare var _;

export class PrototypeGiftService {
  amount: number;
  predefined_amount: number;
  custom_amount: number;
  fund: string = 'I\'m In';
  frequency: string = 'One Time';
  payment_type: string;
  account_type: string;
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
    ], (f) => {
      delete(this[f]);
    });
  }

  accountNumber() {
    return this.payment_type === 'cc' ? this.cc_account_number : this.ach_account_number;
  }
}
