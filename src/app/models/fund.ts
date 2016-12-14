
export class Fund {
    ID: number;
    Name: string;
    Type: number;
    AllowRecurringGiving: boolean;

    constructor( ID: number, Name: string, Type: number, AllowRecurringGiving: boolean) {
        this.ID = ID;
        this.Name = Name;
        this.Type = Type;
        this.AllowRecurringGiving = AllowRecurringGiving;
    }
}
