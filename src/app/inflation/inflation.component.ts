import { Component, OnInit, ViewChild } from '@angular/core';
import vpiIflationYear from 'src/assets/vpiinflationyear.json';
import { IHistoricalInflation } from './ihistoricalinflation';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTheme,
  ApexMarkers,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: ApexMarkers;
  stroke: ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  theme: ApexTheme;
};

@Component({
  selector: 'app-inflation',
  templateUrl: './inflation.component.html',
  styleUrls: ['./inflation.component.css']
})

export class InflationComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  
  ihistoricalInflation: IHistoricalInflation = {
    name:'inflation',
    date: [],
    inflationYoY: [],
    priceIndex: []
  };

  constructor() { 

    this.getExtraExpenses();

    this.chartOptions = {
      series: [
        {
          name: 'Inflation Index',
          data: this.ihistoricalInflation.priceIndex,
        },
        {
          name: 'Veränderung zum Vorjahr',
          data: this.ihistoricalInflation.inflationYoY,
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth",
        width: [2, 2],
      },
      title: {
        text: "Inflationsentwicklung",
        align: "center"
      },
      xaxis: {
        type: "datetime",
        categories: this.ihistoricalInflation.date,

      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
            offsetX: -10
          },
          title: {
            text: "Verbraucherpreisindex",
            style: {
              color: "#008FFB"
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: "Inflation",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#00E396",
            offsetX: -10
          },
          title: {
            text: "Veränderung zum Vorjahr in %",
            style: {
              color: "#00E396"
            }
          }
        }
      ],      
      tooltip: {
        x: {
              format: "MM.yyyy"
            }
      },
      legend: {
        offsetX: 40
      }, 
      theme:{
        palette: 'palette1', 
        mode: 'light',
      }
    };
  }

  getExtraExpenses() : void {

     vpiIflationYear.forEach((element) => {
        this.ihistoricalInflation.date.push(element.Date);
        this.ihistoricalInflation.inflationYoY.push(element.InflationYoY);
        this.ihistoricalInflation.priceIndex.push(element.PriceIndex);
      });
  }

  ngOnInit(): void {
  }

}
