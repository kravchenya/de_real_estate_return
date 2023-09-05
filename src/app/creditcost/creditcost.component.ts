import {Component, OnInit} from '@angular/core';
import {IHistoricalRate} from './ihistoricalrate';
import {TranslateService} from '@ngx-translate/core';
import percentageRate10 from '../../assets/annualpercentagerate10.json';
import percentageRate5 from '../../assets/annualpercentagerate5.json';
import percentageNetRate from '../../assets/annualpercentagenetrate.json';
import oldPercentageRate from '../../assets/oldannualpercentagerate.json';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import moment from 'moment';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-creditcost',
  templateUrl: './creditcost.component.html',
  styleUrls: ['./creditcost.component.css'],
})
export class CreditcostComponent implements OnInit {
  apexChart!: ApexCharts;
  historicalRate5!: IHistoricalRate;
  historicalRate10!: IHistoricalRate;
  effectiveRate!: IHistoricalRate;
  oldhistoricalRate5!: IHistoricalRate;
  oldhistoricalRate10!: IHistoricalRate;
  oldEffectiveRate!: IHistoricalRate;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.getExtraExpenses();

    const chartOptions = {
      series: [],
      chart: {
        height: 400,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2],
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 10,
        labels: {
          formatter: function (value: string) {
            return moment(new Date(value)).format('YYYY');
          },
        },
      },
      tooltip: {
        x: {
          format: 'MM.yyyy',
        },
      },
    };

    this.apexChart = new ApexCharts(document.querySelector('#creditCostChart'), chartOptions);
    this.apexChart.render();

    this.translate
      .get([
        'CREDITCOST_INTEREST_RATE_CHANGE',
        'CREDITCOST_INTEREST_RATE_5YEARS_FROM_2003',
        'CREDITCOST_INTEREST_RATE_10YEARS_FROM_2003',
        'CREDITCOST_ANNUAL_INTEREST_RATE',
        'CREDITCOST_INTEREST_RATE_5YEARS_TILL_2003',
        'CREDITCOST_INTEREST_RATE_10YEARS_TILL_2003',
        'CREDITCOST_ANNUAL_INTEREST_RATE_OLD',
      ])
      .subscribe((translatedTexts) => {
        this.apexChart.updateOptions({
          title: {
            text: translatedTexts.CREDITCOST_INTEREST_RATE_CHANGE,
            align: 'center',
          },
          series: [
            {
              name: translatedTexts.CREDITCOST_INTEREST_RATE_5YEARS_FROM_2003,
              data: this.historicalRate5.data,
            },
            {
              name: translatedTexts.CREDITCOST_INTEREST_RATE_10YEARS_FROM_2003,
              data: this.historicalRate10.data,
            },
            {
              name: translatedTexts.CREDITCOST_ANNUAL_INTEREST_RATE,
              data: this.effectiveRate.data,
            },
            {
              name: translatedTexts.CREDITCOST_INTEREST_RATE_5YEARS_TILL_2003,
              data: this.oldhistoricalRate5.data,
            },
            {
              name: translatedTexts.CREDITCOST_INTEREST_RATE_5YEARS_TILL_2003,
              data: this.oldhistoricalRate10.data,
            },
            {
              name: translatedTexts.CREDITCOST_ANNUAL_INTEREST_RATE_OLD,
              data: this.oldEffectiveRate.data,
            },
          ],
        });
      });

    this.translate.onLangChange.subscribe(() => {
      this.translate
        .get([
          'CREDITCOST_INTEREST_RATE_CHANGE',
          'CREDITCOST_INTEREST_RATE_5YEARS_FROM_2003',
          'CREDITCOST_INTEREST_RATE_10YEARS_FROM_2003',
          'CREDITCOST_ANNUAL_INTEREST_RATE',
          'CREDITCOST_INTEREST_RATE_5YEARS_TILL_2003',
          'CREDITCOST_INTEREST_RATE_10YEARS_TILL_2003',
          'CREDITCOST_ANNUAL_INTEREST_RATE_OLD',
        ])
        .subscribe((translatedTexts) => {
          this.apexChart.updateOptions({
            title: {
              text: translatedTexts.CREDITCOST_INTEREST_RATE_CHANGE,
              align: 'center',
            },
            series: [
              {
                name: translatedTexts.CREDITCOST_INTEREST_RATE_5YEARS_FROM_2003,
                data: this.historicalRate5.data,
              },
              {
                name: translatedTexts.CREDITCOST_INTEREST_RATE_10YEARS_FROM_2003,
                data: this.historicalRate10.data,
              },
              {
                name: translatedTexts.CREDITCOST_ANNUAL_INTEREST_RATE,
                data: this.effectiveRate.data,
              },
              {
                name: translatedTexts.CREDITCOST_INTEREST_RATE_5YEARS_TILL_2003,
                data: this.oldhistoricalRate5.data,
              },
              {
                name: translatedTexts.CREDITCOST_INTEREST_RATE_10YEARS_TILL_2003,
                data: this.oldhistoricalRate10.data,
              },
              {
                name: translatedTexts.CREDITCOST_ANNUAL_INTEREST_RATE_OLD,
                data: this.oldEffectiveRate.data,
              },
            ],
          });
        });
    });
  }

  getExtraExpenses(): void {
    this.effectiveRate = {data: new Array<number[]>()} as IHistoricalRate;
    percentageNetRate.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.effectiveRate.data.push([time, element.InterestRate]);
    });

    this.historicalRate5 = {
      data: new Array<number[]>(),
    } as IHistoricalRate;
    percentageRate5.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.historicalRate5.data.push([time, element.InterestRate]);
    });

    this.historicalRate10 = {
      data: new Array<number[]>(),
    } as IHistoricalRate;
    percentageRate10.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.historicalRate10.data.push([time, element.InterestRate]);
    });

    this.oldhistoricalRate5 = {
      data: new Array<number[]>(),
    } as IHistoricalRate;

    this.oldhistoricalRate10 = {
      data: new Array<number[]>(),
    } as IHistoricalRate;

    this.oldEffectiveRate = {
      data: new Array<number[]>(),
    } as IHistoricalRate;

    oldPercentageRate.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.oldhistoricalRate5.data.push([time, element.Year5]);
      this.oldhistoricalRate5.data.push([time, element.Year5]);
      this.oldhistoricalRate10.data.push([time, element.Year10]);
      this.oldEffectiveRate.data.push([time, element.AnnualRate]);
    });
  }
}
