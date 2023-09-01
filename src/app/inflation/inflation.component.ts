import {Component, OnInit, ViewChild} from '@angular/core';
import vpiIflationYear from '../../assets/vpiinflationyear.json';
import {IHistoricalInflation} from './ihistoricalinflation';
import {MatDatepicker} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from '@angular/material/core';
import {Moment} from 'moment';
import moment from 'moment';

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
  ApexStroke,
} from 'ng-apexcharts';

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

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-inflation',
  templateUrl: './inflation.component.html',
  styleUrls: ['./inflation.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class InflationComponent implements OnInit {
  @ViewChild('inflationChart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  ihistoricalInflation: IHistoricalInflation = {
    name: 'inflation',
    date: [],
    inflationYoY: [],
    priceIndex: [],
  };

  startDate: FormControl = new FormControl(moment(vpiIflationYear[0].Date));
  minStartDate: Date = new Date(vpiIflationYear[0].Date);
  maxEndDate: Date = new Date(vpiIflationYear[vpiIflationYear.length - 1].Date);

  initializeData(): void {
    vpiIflationYear.forEach((element) => {
      this.ihistoricalInflation.date.push(element.Date);
      this.ihistoricalInflation.inflationYoY.push(element.InflationYoY);
      this.ihistoricalInflation.priceIndex.push(element.PriceIndex);
    });
  }

  ngOnInit(): void {
    this.initializeData();
    this.chartOptions = this.createChartOption();
  }

  onClosed() {
    const strDate = this.startDate.value.format('YYYY-MM');
    const startIndex = vpiIflationYear.findIndex((vpi) => vpi.Date === strDate);
    const newInflationIndex: number[] = [];
    newInflationIndex[startIndex] = 100;
    for (let i = startIndex; i < vpiIflationYear.length - 1; i++) {
      newInflationIndex[i + 1] =
        newInflationIndex[i] + (newInflationIndex[i] * vpiIflationYear[i + 1].InflationYoY) / 100;
      newInflationIndex[i] = Math.round((newInflationIndex[i] + Number.EPSILON) * 100) / 100;
    }
    newInflationIndex[this.ihistoricalInflation.priceIndex.length - 1] =
      Math.round(
        (newInflationIndex[this.ihistoricalInflation.priceIndex.length - 1] + Number.EPSILON) * 100,
      ) / 100;

    this.ihistoricalInflation.priceIndex = newInflationIndex.slice(startIndex);
    const vpiSubArray = vpiIflationYear.slice(startIndex);
    this.ihistoricalInflation.date = vpiSubArray.map((vpi) => vpi.Date);
    this.ihistoricalInflation.inflationYoY = vpiSubArray.map((vpi) => vpi.InflationYoY);

    this.chart.updateOptions(this.createChartOption());
  }

  chosenStartYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.startDate.value;
    ctrlValue.year(normalizedYear.year());
    this.startDate.setValue(ctrlValue);
    datepicker.close();
  }

  createChartOption(): Partial<ChartOptions> {
    const options: Partial<ChartOptions> = {
      series: [
        {
          name: 'Inflation Index',
          data: this.ihistoricalInflation.priceIndex,
        },
        {
          name: 'Veränderung zum Vorjahr',
          data: this.ihistoricalInflation.inflationYoY,
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2],
      },
      title: {
        text: 'Inflationsentwicklung',
        align: 'center',
      },
      xaxis: {
        type: 'datetime',
        categories: this.ihistoricalInflation.date,
      },
      yaxis: [
        {
          labels: {
            formatter: function (value: number) {
              return value.toFixed(2);
            },
          },
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
            offsetX: -10,
          },
          title: {
            text: 'Verbraucherpreisindex',
            style: {
              color: '#008FFB',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          labels: {
            formatter: function (value: number) {
              return value.toFixed(2);
            },
          },
          axisBorder: {
            show: true,
            color: '#00E396',
            offsetX: -10,
          },
          seriesName: 'Inflation',
          opposite: true,
          axisTicks: {
            show: true,
          },
          title: {
            text: 'Veränderung zum Vorjahr in %',
            style: {
              color: '#00E396',
            },
          },
        },
      ],
      tooltip: {
        x: {
          format: 'MM.yyyy',
        },
      },
      legend: {
        offsetX: 40,
      },
      theme: {
        palette: 'palette1',
        mode: 'light',
      },
    };
    return options;
  }
}
