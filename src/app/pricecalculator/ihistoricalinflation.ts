import { FormControl } from "@angular/forms";

export interface IHistoricalInflation {
    name: string;
    date: Date;
    inflationChangeYoY: number;
    VpiIndex: number;
}


export interface ICreditData {
    interestRate: number;

    minStartDate: Date;
    minEndDate: Date;
    endDate: FormControl;
    startDate: FormControl;
    maxDate: Date;
}