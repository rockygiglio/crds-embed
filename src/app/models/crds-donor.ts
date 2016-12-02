
export class CrdsDonor {

    stripe_token_id: number;
    email_address: string;
    first_name: string;
    last_name: string;
    rest_method: string;

    constructor(stripe_token_id: number, email_address: string, first_name: string, last_name: string, rest_method: string) {
        this.stripe_token_id = stripe_token_id;
        this.email_address = email_address;
        this.first_name = first_name;
        this.last_name = last_name;
        this.rest_method = rest_method;
    }
}
