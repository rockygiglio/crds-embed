
export class PaymentCallBody {

    programId: string; // emptyString for payments, required for donations
    amount: number;
    pymt_type: string; // 'bank' or 'cc'
    transaction_type: string; // 'DONATION' or 'PAYMENT'
    invoice_id: number;

    constructor(programId: string | null, amount: number, pymt_type: string, transaction_type: string, invoice_id: number) {
        this.programId = programId;
        this.amount = amount;
        this.pymt_type = pymt_type;
        this.transaction_type = transaction_type;
        this.invoice_id = invoice_id;
    }

}

