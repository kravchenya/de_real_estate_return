import {Component, OnDestroy, OnInit} from '@angular/core';
import vpiIflationYear from '../../assets/vpiinflationyear.json';
import {IHistoricalInflation} from './ihistoricalinflation';
import {MatDatepicker} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from '@angular/material/core';
import {Moment} from 'moment';
import moment from 'moment';

import {
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
import {TranslateService} from '@ngx-translate/core';

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

interface TranslatedTexts {
  INFLATION_GRAPH_TITLE: string;
  INFLATION_CONSUMER_PRICE_INDEX: string;
  INFLATION_CONSUMER_PRICE_INDEX_YOY: string;
  INFLATION_Y_AXIS_TITLE_INDEX_INFLATION: string;
  INFLATION_Y_AXIS_TITLE_YOY_CHANGE: string;
}

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
export class InflationComponent implements OnInit, OnDestroy {
  apexChart!: ApexCharts;

  ihistoricalInflation: IHistoricalInflation = {
    name: 'inflation',
    date: [],
    inflationYoY: [],
    priceIndex: [],
  };

  startDate: FormControl = new FormControl(moment(vpiIflationYear[0].Date));
  minStartDate: Date = new Date(vpiIflationYear[0].Date);
  maxEndDate: Date = new Date(vpiIflationYear[vpiIflationYear.length - 1].Date);

  constructor(private translate: TranslateService) {}

  ngOnDestroy() {
    this.apexChart.destroy();
  }

  ngOnInit(): void {
    this.initializeData();
    const chartOptions = this.createChartOption();

    this.apexChart = new ApexCharts(document.querySelector('#inflationChart'), chartOptions);
    this.apexChart.render();

    this.translate
      .get([
        'INFLATION_GRAPH_TITLE',
        'INFLATION_CONSUMER_PRICE_INDEX',
        'INFLATION_CONSUMER_PRICE_INDEX_YOY',
        'INFLATION_Y_AXIS_TITLE_INDEX_INFLATION',
        'INFLATION_Y_AXIS_TITLE_YOY_CHANGE',
      ])
      .subscribe((translatedTexts) => {
        this.apexChart.updateOptions(this.initOptions(translatedTexts));
      });

    this.translate.onLangChange.subscribe(() => {
      this.translate
        .get([
          'INFLATION_GRAPH_TITLE',
          'INFLATION_CONSUMER_PRICE_INDEX',
          'INFLATION_CONSUMER_PRICE_INDEX_YOY',
          'INFLATION_Y_AXIS_TITLE_INDEX_INFLATION',
          'INFLATION_Y_AXIS_TITLE_YOY_CHANGE',
        ])
        .subscribe((translatedTexts) => {
          this.apexChart.updateOptions(this.initOptions(translatedTexts));
        });
    });
  }

  private initOptions(translatedTexts: TranslatedTexts) {
    return {
      title: {
        text: translatedTexts.INFLATION_GRAPH_TITLE,
        align: 'center',
      },
      series: [
        {
          name: translatedTexts.INFLATION_CONSUMER_PRICE_INDEX,
          data: this.ihistoricalInflation.priceIndex,
        },
        {
          name: translatedTexts.INFLATION_CONSUMER_PRICE_INDEX_YOY,
          data: this.ihistoricalInflation.inflationYoY,
        },
      ],
      yaxis: [
        {
          labels: {
            formatter: function (value: number) {
              return value.toFixed(2);
            },
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
            offsetX: -10,
          },
          seriesName: translatedTexts.INFLATION_CONSUMER_PRICE_INDEX,
          title: {
            text: translatedTexts.INFLATION_Y_AXIS_TITLE_INDEX_INFLATION,
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
          opposite: true,
          seriesName: translatedTexts.INFLATION_CONSUMER_PRICE_INDEX_YOY,
          title: {
            text: translatedTexts.INFLATION_Y_AXIS_TITLE_YOY_CHANGE,
            style: {
              color: '#00E396',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      ],
    };
  }

  private initializeData(): void {
    vpiIflationYear.forEach((element) => {
      this.ihistoricalInflation.date.push(element.Date);
      this.ihistoricalInflation.inflationYoY.push(element.InflationYoY);
      this.ihistoricalInflation.priceIndex.push(element.PriceIndex);
    });
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

    this.apexChart.updateOptions(this.createChartOption());
  }

  chosenStartYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.startDate.value;
    ctrlValue.year(normalizedYear.year());
    this.startDate.setValue(ctrlValue);
    datepicker.close();
  }

  private createChartOption(): Partial<ChartOptions> {
    const indexTitle = this.translate.instant('INFLATION_CONSUMER_PRICE_INDEX');
    const yoyTitle = this.translate.instant('INFLATION_CONSUMER_PRICE_INDEX_YOY');

    const indexYaxis = this.translate.instant('INFLATION_Y_AXIS_TITLE_INDEX_INFLATION');
    const yoyYaxis = this.translate.instant('INFLATION_Y_AXIS_TITLE_YOY_CHANGE');

    const options: Partial<ChartOptions> = {
      series: [
        {
          name: indexTitle,
          data: this.ihistoricalInflation.priceIndex,
        },
        {
          name: yoyTitle,
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
          seriesName: indexTitle,
          title: {
            text: indexYaxis,
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
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
            offsetX: -10,
          },
          seriesName: yoyTitle,
          opposite: true,
          title: {
            text: yoyYaxis,
            style: {
              color: '#00E396',
            },
          },
          tooltip: {
            enabled: true,
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
