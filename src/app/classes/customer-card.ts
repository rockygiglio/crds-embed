
export class CustomerCard {
    number: number;
    exp_month: number;
    exp_year: number;
    cvc: number;

    constructor(number: number, exp_month: number, exp_year: number, cvc: number) {
        this.number = number;
        this.exp_month = exp_month;
        this.exp_year = exp_year;
        this.cvc = cvc;
    }
}

