
export class RecurringDonor {

    stripe_token_id: string;
    amount: number;
    program: string;
    interval: string;
    start_date: string;
    source_url: string;
    predefined_amount: number;

    constructor(stripe_token_id: string, amount: number, program: string, interval: string, start_date: string) {
        this.stripe_token_id = stripe_token_id;
        this.amount = amount;
        this.program = program;
        this.interval = interval;
        this.start_date = start_date;
    }
}
