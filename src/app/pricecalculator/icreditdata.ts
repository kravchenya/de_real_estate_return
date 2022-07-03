import { FormControl } from "@angular/forms";

export interface ICreditData {
    interestRate: number;
    minStartDate: Date;
    minEndDate: Date;
    startDate: FormControl;
    endDate: FormControl;
    maxEndDate: Date;
}