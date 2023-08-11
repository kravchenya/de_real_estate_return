import { Component, ViewChild, OnInit } from '@angular/core';
import { IHistoricalRate } from './ihistoricalrate';
import percentageRate10 from 'src/assets/annualpercentagerate10.json';
import percentageRate5 from 'src/assets/annualpercentagerate5.json';
import percentageNetRate from 'src/assets/annualpercentagenetrate.json';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  titel: ApexTitleSubtitle,
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-creditcost',
  templateUrl: './creditcost.component.html',
  styleUrls: ['./creditcost.component.css']
})
export class CreditcostComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  ihistoricalRate5!: IHistoricalRate;
  ihistoricalRate10!: IHistoricalRate;
  effectiveRate!: IHistoricalRate;
  inflation!: IHistoricalRate;

  constructor() { 

    this.getExtraExpenses();

    this.chartOptions = {
      series: [
        {
          name: this.ihistoricalRate5.name,
          data: this.ihistoricalRate5.rate,
        },
        {
          name: this.ihistoricalRate10.name,
          data: this.ihistoricalRate10.rate
        },
        {
          name: this.effectiveRate.name,
          data: this.effectiveRate.rate
        }
      ],
      chart: {
        height: 350,
        type: "line",
        //stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: [2, 2]
      },
      
      xaxis: {
        type: "datetime",
        categories: this.ihistoricalRate10.date
      },
      tooltip: {
        x: {
          format: "MM.yyyy"
        }
      },
      title: {
        text: "Zinsentwicklung",
        align: "center"
      }
    };
  }

  getExtraExpenses() : void {

    this.ihistoricalRate10 = {
      name:'10',
      date: [],
      rate: [],
    };

    percentageRate10.forEach((element) => {
      this.ihistoricalRate10.date.push(element.TimePeriod);
      this.ihistoricalRate10.rate.push(element.InterestRate);
    });

    this.ihistoricalRate5 = {
      name:'5',
      date: [],
      rate: [],
    };

    percentageRate5.forEach((element) => {
      this.ihistoricalRate5.date.push(element.TimePeriod);
      this.ihistoricalRate5.rate.push(element.InterestRate);
    });

    this.effectiveRate = {
      name:'effective rate',
      date: [],
      rate: [],
    };

    percentageNetRate.forEach((element) => {
      this.effectiveRate.date.push(element.TimePeriod);
      this.effectiveRate.rate.push(element.InterestRate);
    });
  }

  ngOnInit(): void {
  }
}
