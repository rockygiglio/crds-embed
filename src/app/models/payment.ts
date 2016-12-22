
export class Payment {

    program_id: string;
    amount: number;
    pymt_type: string;
    transaction_type: string;
    invoice_id: number;
    donor_id: number;
    email_address: string;
    source_url: string;
    predefined_amount: number;

    constructor(program_id: string, amount: number, pymt_type: string, transaction_type: string, invoice_id: number) {
        this.program_id = program_id;
        this.amount = amount;
        this.pymt_type = pymt_type;
        this.transaction_type = transaction_type;
        this.invoice_id = invoice_id;
    }

}
