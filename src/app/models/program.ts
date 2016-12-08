
export class Program {
    AllowRecurringGiving: boolean;
    Name: string;
    ProgramId: number;
    ProgramType: number;

    constructor(AllowRecurringGiving: boolean, Name: string, ProgramId: number, ProgramType: number) {
        this.AllowRecurringGiving = AllowRecurringGiving;
        this.Name = Name;
        this.ProgramId = ProgramId;
        this.ProgramType = ProgramType;
    }
}