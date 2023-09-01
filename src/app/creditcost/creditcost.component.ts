import {Component, ViewChild, OnInit} from '@angular/core';
import {IHistoricalRate} from './ihistoricalrate';
import percentageRate10 from '../../assets/annualpercentagerate10.json';
import percentageRate5 from '../../assets/annualpercentagerate5.json';
import percentageNetRate from '../../assets/annualpercentagenetrate.json';
import oldPercentageRate from '../../assets/oldannualpercentagerate.json';

import {
  ChartComponent,
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
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  historicalRate5!: IHistoricalRate;
  historicalRate10!: IHistoricalRate;
  effectiveRate!: IHistoricalRate;
  oldhistoricalRate5!: IHistoricalRate;
  oldhistoricalRate10!: IHistoricalRate;
  oldEffectiveRate!: IHistoricalRate;

  ngOnInit(): void {
    this.getExtraExpenses();

    this.chartOptions = {
      series: [
        {
          name: this.historicalRate5.name,
          data: this.historicalRate5.data,
        },
        {
          name: this.historicalRate10.name,
          data: this.historicalRate10.data,
        },
        {
          name: this.effectiveRate.name,
          data: this.effectiveRate.data,
        },
        {
          name: this.oldhistoricalRate5.name,
          data: this.oldhistoricalRate5.data,
        },
        {
          name: this.oldhistoricalRate10.name,
          data: this.oldhistoricalRate10.data,
        },
        {
          name: this.oldEffectiveRate.name,
          data: this.oldEffectiveRate.data,
        },
      ],
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
      title: {
        text: 'Zinsentwicklung',
        align: 'center',
      },
    };
  }

  getExtraExpenses(): void {
    this.effectiveRate = {
      name: 'Effektiver Jahreszinssatz',
      data: new Array<number[]>(),
    };
    this.historicalRate5 = {
      name: 'Jahreszinssatz auf 5 Jahre ab 2003',
      data: new Array<number[]>(),
    };
    this.historicalRate10 = {
      name: 'Jahreszinssatz auf 10 Jahre ab 2003',
      data: new Array<number[]>(),
    };

    percentageNetRate.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.effectiveRate.data.push([time, element.InterestRate]);
    });

    percentageRate5.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.historicalRate5.data.push([time, element.InterestRate]);
    });

    percentageRate10.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.historicalRate10.data.push([time, element.InterestRate]);
    });

    this.oldhistoricalRate5 = {
      name: 'Jahreszinssatz auf 5 Jahre von 1991 bis 2003',
      data: new Array<number[]>(),
    };
    this.oldhistoricalRate10 = {
      name: 'Jahreszinssatz auf 10 Jahre von 1991 bis 2003',
      data: new Array<number[]>(),
    };
    this.oldEffectiveRate = {
      name: 'Effektiver Jahreszinssatz',
      data: new Array<number[]>(),
    };

    oldPercentageRate.forEach((element) => {
      const time = new Date(element.Date).getTime();
      this.oldhistoricalRate5.data.push([time, element.Year5]);
      this.oldhistoricalRate5.data.push([time, element.Year5]);
      this.oldhistoricalRate10.data.push([time, element.Year10]);
      this.oldEffectiveRate.data.push([time, element.AnnualRate]);
    });
  }
}
