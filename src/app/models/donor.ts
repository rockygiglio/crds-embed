
export class Donor {

  donor_id: number;
  stripe_token_id: number;
  email_address: string;
  rest_method: string;

  constructor(stripe_token_id: number, email_address: string, rest_method: string) {
    this.stripe_token_id = stripe_token_id;
    this.email_address = email_address;
    this.rest_method = rest_method;
  }
}
