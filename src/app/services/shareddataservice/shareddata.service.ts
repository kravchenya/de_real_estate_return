import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IHistoricalRate} from './ihistoricalrate';
import msciAcwiIndex from '../../../assets/msciacwiindex.json';
import vpiInflationMonthly from '../../../assets/vpiinflationmonthly.json';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor() {
    this.calculateMsciData('1991-01', '2020-12', 100000, 20000, 10000, 5);
  }

  private overallAbsolutReturnReal = new BehaviorSubject<number>(0);
  overallAbsolutReturnReal$ = this.overallAbsolutReturnReal.asObservable();

  private overallAbsolutReturnNominal = new BehaviorSubject<number>(0);
  overallAbsolutReturnNominal$ = this.overallAbsolutReturnNominal.asObservable();

  private annualizedReturnReal = new BehaviorSubject<number>(0);
  annualizedReturnReal$ = this.annualizedReturnReal.asObservable();

  private annualizedReturnNominal = new BehaviorSubject<number>(0);
  annualizedReturnNominal$ = this.annualizedReturnNominal.asObservable();

  private msciDevelopmentReal = new BehaviorSubject<IHistoricalRate>({
    date: [],
    rate: [],
  });
  msciDevelopmentReal$ = this.msciDevelopmentReal.asObservable();

  private msciDevelopmentNominal = new BehaviorSubject<IHistoricalRate>({
    date: [],
    rate: [],
  });
  msciDevelopmentNominal$ = this.msciDevelopmentNominal.asObservable();

  calculateMsciData(
    startDate: string,
    endDate: string,
    loanAmount: number,
    downPayment: number,
    closingCost: number,
    annualPercentageRate: number,
  ) {
    const msciDevelopmentNominalInterim: IHistoricalRate = {
      date: [],
      rate: [],
    };
    const msciDevelopmentRealInterim: IHistoricalRate = {
      date: [],
      rate: [],
    };

    const startIndex = msciAcwiIndex.findIndex((msciAcwi) => msciAcwi.Date === startDate);
    const endIndex = msciAcwiIndex.findIndex((msciAcwi) => msciAcwi.Date === endDate);

    const paymentsNumberInMonth = endIndex - startIndex + 1; // +1 cause we need to pay for the first month too
    const monthlyInterest = this.calculateMonthlyInterest(
      loanAmount,
      annualPercentageRate,
      paymentsNumberInMonth,
    );

    const initialCost = closingCost + downPayment;
    let capitalGainNominal = initialCost + monthlyInterest; // therefore i = startIndex + 1 we start from index + 1, however we have a still initial payment
    let capitalGainReal = capitalGainNominal;

    msciDevelopmentNominalInterim.rate.push(capitalGainNominal);
    msciDevelopmentNominalInterim.date.push(msciAcwiIndex[startIndex].Date);

    msciDevelopmentRealInterim.rate.push(capitalGainReal);
    msciDevelopmentRealInterim.date.push(msciAcwiIndex[startIndex].Date);

    let monthlyPaymentsReal = monthlyInterest; // in the very first month we do not have inflation MoM, therefore i = startIndex + 1 we start from index + 1, however we have a still initial payment
    let totalInitialPaymentReal = initialCost;

    for (let i = startIndex + 1; i <= endIndex; i++) {
      // we do not apply inflation for the  monthly interest at the current month, but to the previous month cause inflation is Month-over-Month
      monthlyPaymentsReal =
        monthlyPaymentsReal * (1 - vpiInflationMonthly[i].InflationMoM / 100) + monthlyInterest;
      totalInitialPaymentReal =
        totalInitialPaymentReal * (1 - vpiInflationMonthly[i].InflationMoM / 100);

      // we do not apply market gain for the  monthly investment at the current month, but to the previous month cause market gain is Month-over-Month
      capitalGainNominal = capitalGainNominal * (1 + msciAcwiIndex[i].MoM) + monthlyInterest;
      msciDevelopmentNominalInterim.date.push(msciAcwiIndex[i].Date);
      msciDevelopmentNominalInterim.rate.push(capitalGainNominal);

      capitalGainReal =
        capitalGainReal *
          (1 + msciAcwiIndex[i].MoM) *
          (1 - vpiInflationMonthly[i].InflationMoM / 100) +
        monthlyInterest;
      msciDevelopmentRealInterim.date.push(msciAcwiIndex[i].Date);
      msciDevelopmentRealInterim.rate.push(capitalGainReal);
    }

    this.msciDevelopmentReal.next(msciDevelopmentRealInterim);
    this.msciDevelopmentNominal.next(msciDevelopmentNominalInterim);

    const paymentsNumberInYears = paymentsNumberInMonth / 12;

    this.overallAbsolutReturnReal.next(
      Math.round((msciDevelopmentRealInterim.rate[endIndex - startIndex] + Number.EPSILON) * 100) /
        100,
    );
    const totalInvestementReal = totalInitialPaymentReal + monthlyPaymentsReal;
    this.annualizedReturnReal.next(
      this.calculateAnnualizedReturn(
        msciDevelopmentRealInterim.rate[endIndex - startIndex],
        totalInvestementReal,
        paymentsNumberInYears,
      ),
    );

    this.overallAbsolutReturnNominal.next(
      Math.round(
        (msciDevelopmentNominalInterim.rate[endIndex - startIndex] + Number.EPSILON) * 100,
      ) / 100,
    );
    const totalInvestementNominal = initialCost + monthlyInterest * paymentsNumberInMonth;
    this.annualizedReturnNominal.next(
      this.calculateAnnualizedReturn(
        msciDevelopmentNominalInterim.rate[endIndex - startIndex],
        totalInvestementNominal,
        paymentsNumberInYears,
      ),
    );
  }

  private calculateMonthlyInterest(
    creditAmount: number,
    effectiveAnnualRate: number,
    creditDarutionInMonth: number,
  ): number {
    // i_nominal_rate = (1 + r_effektiv_annual_rate_as_decimal ) ^ 1/n − 1
    // Where:
    // i_nominal_rate is "periodic interest rate" or "nominal interest rate"
    // n number of interest payment per year (i.e. 12 for monthly payments)
    // var nominalInterestRate = Math.pow(1 + effectiveAnnualRate/100, 1/12) - 1 // compaund way to calculate interest rate paid monthly
    const nominalInterestRate = effectiveAnnualRate / 100 / 12; // simple way to calculate interest rate paid monthly

    // Credit cost Z = P × (r x (1 + r)^n) / ((1+r)^n−1)
    // Where:
    // Z is cost of credit over total credit duration. Also see "Amortization Schedule" for reference
    // P is credit amount (initial sum of money borrowed from a bank)
    // r is periodic (nominal) interest rate
    // n is total amount of interest payment periods

    return (
      (creditAmount *
        nominalInterestRate *
        Math.pow(1 + nominalInterestRate, creditDarutionInMonth)) /
      (Math.pow(1 + nominalInterestRate, creditDarutionInMonth) - 1)
    );
  }

  private calculateAnnualizedReturn(
    capitalGain: number,
    investedAmount: number,
    duration: number,
  ): number {
    // annualized return, also known as the compound annual growth rate
    // CAGR = ( Final Value / Initial Investment  ) ^ (1 / Number of Years) − 1
    const returnPerAnnum = (Math.pow(capitalGain / investedAmount, 1 / duration) - 1) * 100;
    return Math.round((returnPerAnnum + Number.EPSILON) * 100) / 100;
  }
}
