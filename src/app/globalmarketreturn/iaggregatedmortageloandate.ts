import {IMortageLoanData} from './imortageloandata';

export interface IAggregatedMortageLoanData {
  downPayment: number;
  mortageIntervals: IMortageLoanData[];
}
