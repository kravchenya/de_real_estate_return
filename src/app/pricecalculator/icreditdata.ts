import { FormControl } from "@angular/forms";

export interface ICreditData {
    annualPercentageRate: number;
    minStartDate: Date;
    minEndDate: Date;
    maxEndDate: Date;
    startDate: FormControl;
    endDate: FormControl;
}