import { Component, OnInit, ViewChild } from '@angular/core';
import vpiIflationYear from 'src/assets/vpiiflationyear.json';
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
  ApexTheme
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
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
    inflationChangeYoY: [],
    VpiIndex: []
  };


  constructor() { 

    this.getExtraExpenses();

    this.chartOptions = {
      series: [
        {
          name: 'Inflation Index',
          data: this.ihistoricalInflation.VpiIndex,
        },
        {
          name: 'Veränderung zum Vorjahr',
          data: this.ihistoricalInflation.inflationChangeYoY,
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth",
        width: [2, 2],
        // width: [1, 1, 4]
      },
      title: {
        text: "Inflation Entwicklung (1991-2021)",
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
          labels: {
            style: {
              //color: "#008FFB"
            }
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
          labels: {
            style: {
              //color: "#00E396"
            }
          },
          title: {
            text: "Veränderung zum Vorjahr in %",
            style: {
              color: "#00E396"
            }
          }
        }
      ],      
      // axisTicks: {
      //   show: true
      // },
      // axisBorder: {
      //   show: true,
      //   color: "#FF1654"
      // },
      // labels: {
      //   style: {
      //     colors: "#FF1654"
      //   }
      // },
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      // tooltip: {
      //   x: {
      //     format: "MM.yyyy"
      //   }
      // },
      legend: {
        // horizontalAlign: "center",
        offsetX: 40
      }, 
      theme:{
        palette: 'palette1', 
        mode: 'light',
      }
    };
  }

  getExtraExpenses() : void {

  //   var fs = require('fs');
  //   var t = vpiIflationYear;
  //   t.reverse();
  //   fs.writeFile ("src/assets/input.json", JSON.stringify(t), function(err: any) {
  //     if (err) throw err;
  //     console.log('complete');
  //     }
  // );

     vpiIflationYear.forEach((element) => {
        this.ihistoricalInflation.date.push(element.Date);
        this.ihistoricalInflation.inflationChangeYoY.push(parseFloat(element.InflationChangeYoY));
        this.ihistoricalInflation.VpiIndex.push(parseFloat(element.VpiIndex));
      });
  }

  ngOnInit(): void {
  }

}
