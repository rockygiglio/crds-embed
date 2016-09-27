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
  account_number: string;
  exp_date: string;
  start_date: string;
  cvv: string;
  zip_code: string;
  email: string;
  is_guest: boolean = false;

  resetDate() {
    this.start_date = undefined;
    return false;
  }
}
