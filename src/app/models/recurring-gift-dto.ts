
export class RecurringGiftDto {

    stripe_token_id: string;
    amount: number;
    program: string; // actually the programId
    interval: string; // 'week' or 'month'
    start_date: Date;

    constructor(stripe_token_id: string, amount: number, program: string, interval: string, start_date: Date) {
        this.stripe_token_id = stripe_token_id;
        this.amount = amount;
        this.program = program;
        this.interval = interval;
        this.start_date = start_date;
    }

}
