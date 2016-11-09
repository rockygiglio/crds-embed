
export class CustomerBank {

  country: string;
  currency: string;
  routing_number: number;
  account_number: number;
  account_holder_name: string;
  account_holder_type: string;

  constructor(country: string, currency: string, routing_number: number, account_number: number,
              account_holder_name: string, account_holder_type: string) {
    this.country = country;
    this.currency = currency;
    this.routing_number = routing_number;
    this.account_number = account_number;
    this.account_holder_name = account_holder_name;
    this.account_holder_type = account_holder_type;
  }
}