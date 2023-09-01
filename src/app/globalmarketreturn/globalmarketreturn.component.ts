import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {ChartOptions} from '../additionalcost/additionalcost.component';
import {IHistoricalRate} from './ihistoricalrate';
import msciAcwiIndex from '../../assets/msciacwiindex.json';
import vpiInflationMonthly from '../../assets/vpiinflationmonthly.json';
import {IMortageLoanData} from './imortageloandata';
import {IAggregatedMortageLoanData} from './iaggregatedmortageloandate';

@Component({
  selector: 'app-globalmarketreturn',
  templateUrl: './globalmarketreturn.component.html',
  styleUrls: ['./globalmarketreturn.component.css'],
})
export class GlobalMarketReturnComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  msciDevelopmentNominal!: IHistoricalRate;
  msciDevelopmentReal!: IHistoricalRate;
  inflation!: IHistoricalRate;

  aggregatedCreditData: IAggregatedMortageLoanData = {} as IAggregatedMortageLoanData;
  overallAbsolutReturnNominal = 0.0;
  overallAbsolutReturnReal = 0.0;
  annualizedReturnReal = 0.0;
  annualizedReturnNominal = 0.0;
  totalExpenseRatio = 0.0;

  constructor() {
    const creditDataItem: IMortageLoanData = {
      annualPercentageRate: 5.0,
      closingCost: 20000,
      loanAmount: 100000,
      startDate: new Date('1991-01'),
      endDate: new Date('2020-12'),
    };

    this.aggregatedCreditData = {
      mortageIntervals: [creditDataItem],
      downPayment: 10000,
    };

    this.msciDevelopmentNominal = {
      name: 'MSCI ACWI',
      date: [],
      rate: [],
    };

    this.msciDevelopmentReal = {
      name: 'MSCI ACWI inflation angepasst',
      date: [],
      rate: [],
    };

    this.chartOptions = {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: this.msciDevelopmentNominal.name,
          data: this.msciDevelopmentNominal.rate,
        },
        {
          name: this.msciDevelopmentReal.name,
          data: this.msciDevelopmentReal.rate,
        },
      ],
      stroke: {
        curve: 'smooth',
        width: [2, 2],
      },
      title: {
        text: 'MSCI ACWI Entwicklung',
        align: 'center',
      },
      tooltip: {
        x: {
          format: 'MM.yyyy',
        },
      },
      xaxis: {
        type: 'datetime',
        categories: this.msciDevelopmentNominal.date,
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return (Math.round(value * 100) / 100).toFixed(2);
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.getMcsiAcwiData();
  }

  getMcsiAcwiData(): void {
    //TODO think about loop here cause of refinancing your credit
    const startDate = this.aggregatedCreditData.mortageIntervals[0].startDate;
    const startIndex = msciAcwiIndex.findIndex(
      (msciAcwi) => new Date(msciAcwi.Date).getTime() === startDate.getTime(),
    );

    const endDate = this.aggregatedCreditData.mortageIntervals[0].endDate;
    const endIndex = msciAcwiIndex.findIndex(
      (msciAcwi) => new Date(msciAcwi.Date).getTime() === endDate.getTime(),
    );

    // Tt is a simple iterest, not a compound
    // Monthly Payment = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    // Where:
    // P = Principal amount (loan amount) = $200,000
    // r = Monthly interest rate = 0.00375
    // n = Total number of payments (loan term in months) = 30 years * 12 months/year = 360 months
    const loanAmount = this.aggregatedCreditData.mortageIntervals[0].loanAmount;
    const monthlyInterestRate =
      this.aggregatedCreditData.mortageIntervals[0].annualPercentageRate / 100 / 12;
    const paymentsNumberInMonth =
      12 * (endDate.getFullYear() - startDate.getFullYear()) +
      endDate.getMonth() -
      startDate.getMonth() +
      1; // +1 cause we need to pay for the first month too
    const monthlyInterest =
      (loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, paymentsNumberInMonth))) /
      (Math.pow(1 + monthlyInterestRate, paymentsNumberInMonth) - 1);

    const initialCost =
      this.aggregatedCreditData.mortageIntervals[0].closingCost +
      this.aggregatedCreditData.downPayment;
    let capitalGainNominal = initialCost + monthlyInterest; // therefore i = startIndex + 1 we start from index + 1, however we have a still initial payment
    let capitalGainReal = capitalGainNominal;

    this.msciDevelopmentNominal.rate.push(capitalGainNominal);
    this.msciDevelopmentNominal.date.push(msciAcwiIndex[startIndex].Date);

    this.msciDevelopmentReal.rate.push(capitalGainReal);
    this.msciDevelopmentReal.date.push(msciAcwiIndex[startIndex].Date);

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
      this.msciDevelopmentNominal.date.push(msciAcwiIndex[i].Date);
      this.msciDevelopmentNominal.rate.push(capitalGainNominal);

      capitalGainReal =
        capitalGainReal *
          (1 + msciAcwiIndex[i].MoM) *
          (1 - vpiInflationMonthly[i].InflationMoM / 100) +
        monthlyInterest;
      this.msciDevelopmentReal.date.push(msciAcwiIndex[i].Date);
      this.msciDevelopmentReal.rate.push(capitalGainReal);
    }

    const paymentsNumberInYears = paymentsNumberInMonth / 12;

    this.overallAbsolutReturnReal =
      Math.round((this.msciDevelopmentReal.rate[endIndex] + Number.EPSILON) * 100) / 100;
    const totalInvestementReal = totalInitialPaymentReal + monthlyPaymentsReal;
    this.annualizedReturnReal = this.calculateAnnualizedReturn(
      this.msciDevelopmentReal.rate[endIndex],
      totalInvestementReal,
      paymentsNumberInYears,
    );

    this.overallAbsolutReturnNominal =
      Math.round((this.msciDevelopmentNominal.rate[endIndex] + Number.EPSILON) * 100) / 100;
    const totalInvestementNominal = initialCost + monthlyInterest * paymentsNumberInMonth;
    this.annualizedReturnNominal = this.calculateAnnualizedReturn(
      this.msciDevelopmentNominal.rate[endIndex],
      totalInvestementNominal,
      paymentsNumberInYears,
    );
  }

  private calculateTer(): number {
    // p is TER per month as we have DCA and invest every month, i.e TER p.a. is 1% means TER p. month is 1% / 12 /100 in decemal
    // t is Number of monthly investments;
    // k is coefficient for a year prortion i.e. 1/12, 2/12, 3/12, ... , 12/12
    // M is total invested amount + invested every month sum of money
    // Sum i= 1..t, k=1..12 (k / 12 * P * M))
    return 0.0;
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
