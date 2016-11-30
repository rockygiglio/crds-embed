
export class CustomerCard {

    name: string;
    number: number;
    exp_month: number;
    exp_year: number;
    cvc: number;
    address_zip: number;

    constructor(name: string, number: number, exp_month: number, exp_year: number, cvc: number, address_zip: number) {
        this.name = name;
        this.number = number;
        this.exp_month = exp_month;
        this.exp_year = exp_year;
        this.cvc = cvc;
        this.address_zip = address_zip;
    }
}
