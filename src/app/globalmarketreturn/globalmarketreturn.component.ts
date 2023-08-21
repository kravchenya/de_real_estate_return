import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from '../additionalcost/additionalcost.component';
import { IHistoricalRate } from './ihistoricalrate';
import msciAcwiIndex from 'src/assets/msciacwiindex.json';
import vpiInflationMonthly from 'src/assets/vpiinflationmonthly.json';
import { IMortageLoanData } from './imortageloandata';
import { IAggregatedMortageLoanData } from './iaggregatedmortageloandate';

@Component({
  selector: 'app-globalmarketreturn',
  templateUrl: './globalmarketreturn.component.html',
  styleUrls: ['./globalmarketreturn.component.css']
})
export class GlobalMarketReturnComponent implements OnInit{

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  msciDevelopmentNominal!: IHistoricalRate;
  msciDevelopmentReal!: IHistoricalRate;
  msciDevelopmentRealTer!: IHistoricalRate;
  inflation!: IHistoricalRate;

  aggregatedCreditData: IAggregatedMortageLoanData = {} as IAggregatedMortageLoanData;

  constructor() {

    const creditDataItem: IMortageLoanData = {
      annualPercentageRate: 5.0,
      closingCost: 20000,
      loanAmount: 100000,
      startDate: new Date("1991-01"),
      endDate: new Date("2021-01"),
    };

    this.aggregatedCreditData =  {
      mortageIntervals : [creditDataItem],
      downPayment: 100000,
    }

    this.msciDevelopmentNominal = {
      name:'MSCI ACWI',
      date: [],
      rate: [],
    };

    this.msciDevelopmentReal = {
      name:'MSCI ACWI inflation angepasst',
      date: [],
      rate: [],
    };

    this.msciDevelopmentRealTer = {
      name:'MSCI ACWI inflation angepasst mit 1% Nebenkosten',
      date: [],
      rate: [],
    };

    this.chartOptions = {
      chart: {
        type: "line",
        height: 400,
        toolbar: {
          show: false
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
        {
          name: this.msciDevelopmentRealTer.name,
          data: this.msciDevelopmentRealTer.rate,
        },
      ],
      stroke: {
        curve: "smooth",
        width: [2, 2]
      },
      title: {
        text: "MSCI ACWI Entwicklung",
        align: "center"
      },
      tooltip: {
        x: {
          format: "MM.yyyy"
        }
      },
      xaxis: {
        type: "datetime",
        categories: this.msciDevelopmentNominal.date
      },
      yaxis: {
        labels: {
          formatter: function(value: number) {
            return (Math.round(value * 100) / 100).toFixed(2);
          }
        },
      },
    };
   }

  ngOnInit(): void {
    this.getMcsiAcwiData();
  }

  getMcsiAcwiData() : void {

    //TODO think about loop here cause of refinancing your credit
    var startDate = this.aggregatedCreditData.mortageIntervals[0].startDate;
    var endDate = this.aggregatedCreditData.mortageIntervals[0].endDate;
    var closingCosts = this.aggregatedCreditData.mortageIntervals[0].closingCost;
    var interestRate = this.aggregatedCreditData.mortageIntervals[0].annualPercentageRate;
    var loanAmount = this.aggregatedCreditData.mortageIntervals[0].loanAmount;

    var startIndex = msciAcwiIndex.findIndex(msciAcwi =>  new Date(msciAcwi.Date).getTime() === startDate.getTime());
    var endIndex = msciAcwiIndex.findIndex(msciAcwi =>  new Date(msciAcwi.Date).getTime() === endDate.getTime());

    //Monthly Payment = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    // Where:
    // P = Principal amount (loan amount) = $200,000
    // r = Monthly interest rate = 0.00375
    // n = Total number of payments (loan term in months) = 30 years * 12 months/year = 360 months
    var monthlyRate = interestRate/100/12;
    var totalNumberPayments = 12* (endDate.getFullYear() - startDate.getFullYear()) + endDate.getMonth() - startDate.getMonth();
    var monthlyInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalNumberPayments)) / Math.pow(1 + monthlyRate, totalNumberPayments - 1);
    var initialInvestmentNominal = closingCosts +  this.aggregatedCreditData.downPayment;
    var initialInvestmentReal = initialInvestmentNominal;

    this.msciDevelopmentNominal.rate.push(initialInvestmentNominal);
    this.msciDevelopmentNominal.date.push(msciAcwiIndex[startIndex].Date);

    this.msciDevelopmentReal.rate.push(initialInvestmentNominal);
    this.msciDevelopmentReal.date.push(msciAcwiIndex[startIndex].Date);

    for(var i = startIndex + 1; i < endIndex; i++) {
      initialInvestmentNominal = (monthlyInterest + initialInvestmentNominal) * (1 +  msciAcwiIndex[i].MoM);
      this.msciDevelopmentNominal.date.push(msciAcwiIndex[i].Date);
      this.msciDevelopmentNominal.rate.push(initialInvestmentNominal);

      var iflationRateAdjustment = vpiInflationMonthly[i]!.InflationMoM!/100 * initialInvestmentReal;
      initialInvestmentReal = (monthlyInterest + initialInvestmentReal) * (1 +  msciAcwiIndex[i].MoM) - iflationRateAdjustment;

      this.msciDevelopmentReal.date.push(msciAcwiIndex[i].Date);
      this.msciDevelopmentReal.rate.push(initialInvestmentReal);

      // this.msciDevelopmentRealTer.date.push(msciAcwiIndex[i].Date);
      // this.msciDevelopmentRealTer.rate.push(initialInvestmentReal);
    }
  }
}
