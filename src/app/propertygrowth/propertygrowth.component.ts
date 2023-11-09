import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from '@angular/material/core';
import nominalRentPriceIndex from '../../assets/rentpriceindexannually.json';
import nominalHousePriceIndex from '../../assets/housepriceindexannually.json';
import realHousePriceIndex from '../../assets/realhousepriceindexannually.json';
import nominalHouseToRentIndex from '../../assets/pricetorentindex.json';
import {MatDatepicker} from '@angular/material/datepicker';
import {TranslateService} from '@ngx-translate/core';
import moment, {Moment} from 'moment';
import {IHousePriceIndex} from './ihousepriceindex';

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
  PROPERTY_GROWTH_TITLE: string;
  PROPERTY_GROWTH_HOUSE_NOMINAL_PRICE_INDEX: string;
  PROPERTY_GROWTH_HOUSE_REAL_PRICE_INDEX: string;
  PROPERTY_GROWTH_RENT_NOMINAL_PRICE_INDEX: string;
  PROPERTY_GROWTH_HOUSE_TO_RENT_NOMINAL_INDEX: string;
  INFLATION_Y_AXIS_TITLE_INDEX_INFLATION: string;
  INFLATION_Y_AXIS_TITLE_YOY_CHANGE: string;
}

@Component({
  selector: 'app-propertygrowth',
  templateUrl: './propertygrowth.component.html',
  styleUrls: ['./propertygrowth.component.css'],
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
export class PropertyGrowthComponent implements OnInit {
  apexChart!: ApexCharts;

  ihousePriceIndex: IHousePriceIndex = {
    name: 'house price index',
    date: [],
    nominalHousePriceIndex: [],
    nominalRentPriceIndex: [],
    realHousePriceIndex: [],
    nominalHouseToRentIndex: [],
  };

  annualizedNominalHouseReturn = 0.0;
  annualizedRealHouseReturn = 0.0;
  annualizedNominalRentalReturn = 0.0;

  startDate: FormControl = new FormControl(moment(nominalHousePriceIndex[0].Date));
  minStartDate: Date = new Date(nominalHousePriceIndex[0].Date);
  maxEndDate: Date = new Date(nominalHousePriceIndex[nominalHousePriceIndex.length - 1].Date);

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.initializeData();
    const chartOptions = this.createChartOption();

    this.apexChart = new ApexCharts(document.querySelector('#propertyPrices'), chartOptions);
    this.apexChart.render();

    const inflationTexts = [
      'PROPERTY_GROWTH_TITLE',
      'PROPERTY_GROWTH_HOUSE_NOMINAL_PRICE_INDEX',
      'PROPERTY_GROWTH_HOUSE_REAL_PRICE_INDEX',
      'PROPERTY_GROWTH_HOUSE_TO_RENT_NOMINAL_INDEX',
      'PROPERTY_GROWTH_RENT_NOMINAL_PRICE_INDEX',
      'INFLATION_Y_AXIS_TITLE_INDEX_INFLATION',
      'INFLATION_Y_AXIS_TITLE_YOY_CHANGE',
    ];

    this.translate.get(inflationTexts).subscribe((translatedTexts) => {
      this.apexChart.updateOptions(this.initOptions(translatedTexts));
    });

    this.translate.onLangChange.subscribe(() => {
      this.translate.get(inflationTexts).subscribe((translatedTexts) => {
        this.apexChart.updateOptions(this.initOptions(translatedTexts));
      });
    });
  }

  private initializeData(): void {
    realHousePriceIndex.forEach((element) => {
      this.ihousePriceIndex.realHousePriceIndex.push(element.PriceIndex);
    });

    nominalHousePriceIndex.forEach((element) => {
      this.ihousePriceIndex.nominalHousePriceIndex.push(element.PriceIndex);
      this.ihousePriceIndex.date.push(element.Date);
    });

    nominalRentPriceIndex.forEach((element) => {
      this.ihousePriceIndex.nominalRentPriceIndex.push(element.PriceIndex);
    });

    nominalHouseToRentIndex.forEach((element) => {
      this.ihousePriceIndex.nominalHouseToRentIndex.push(element.PriceIndex);
    });
  }

  private initOptions(translatedTexts: TranslatedTexts) {
    return {
      title: {
        text: translatedTexts.PROPERTY_GROWTH_TITLE,
        align: 'center',
      },
      series: [
        {
          name: translatedTexts.PROPERTY_GROWTH_HOUSE_NOMINAL_PRICE_INDEX,
          data: this.ihousePriceIndex.nominalHousePriceIndex,
        },
        {
          name: translatedTexts.PROPERTY_GROWTH_HOUSE_REAL_PRICE_INDEX,
          data: this.ihousePriceIndex.realHousePriceIndex,
        },
        {
          name: translatedTexts.PROPERTY_GROWTH_RENT_NOMINAL_PRICE_INDEX,
          data: this.ihousePriceIndex.nominalRentPriceIndex,
        },
        {
          name: translatedTexts.PROPERTY_GROWTH_HOUSE_TO_RENT_NOMINAL_INDEX,
          data: this.ihousePriceIndex.nominalHouseToRentIndex,
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2],
      },
      xaxis: {
        type: 'datetime',
        categories: this.ihousePriceIndex.date,
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
    };
  }

  onClosed() {
    const strDate = this.startDate.value.format('YYYY-MM');
    const startIndex = nominalRentPriceIndex.findIndex((hpi) => hpi.Date === strDate);

    this.ihousePriceIndex.nominalRentPriceIndex[startIndex] = 100;
    for (let i = startIndex; i < nominalRentPriceIndex.length - 1; i++) {
      this.ihousePriceIndex.nominalRentPriceIndex[i + 1] =
        (this.ihousePriceIndex.nominalRentPriceIndex[i] * nominalRentPriceIndex[i + 1].PriceIndex) /
        nominalRentPriceIndex[i].PriceIndex;
    }

    this.ihousePriceIndex.realHousePriceIndex[startIndex] = 100;
    for (let i = startIndex; i < realHousePriceIndex.length - 1; i++) {
      this.ihousePriceIndex.realHousePriceIndex[i + 1] =
        this.ihousePriceIndex.realHousePriceIndex[i] *
        (realHousePriceIndex[i + 1].PriceIndex / realHousePriceIndex[i].PriceIndex);
    }

    this.ihousePriceIndex.nominalHousePriceIndex[startIndex] = 100;
    for (let i = startIndex; i < nominalHousePriceIndex.length - 1; i++) {
      this.ihousePriceIndex.nominalHousePriceIndex[i + 1] =
        this.ihousePriceIndex.nominalHousePriceIndex[i] *
        (nominalHousePriceIndex[i + 1].PriceIndex / nominalHousePriceIndex[i].PriceIndex);
    }

    this.ihousePriceIndex.nominalHouseToRentIndex[startIndex] = 100;
    for (let i = startIndex; i < nominalHouseToRentIndex.length - 1; i++) {
      this.ihousePriceIndex.nominalHouseToRentIndex[i + 1] =
        this.ihousePriceIndex.nominalHouseToRentIndex[i] *
        (nominalHouseToRentIndex[i + 1].PriceIndex / nominalHouseToRentIndex[i].PriceIndex);
    }

    this.ihousePriceIndex.nominalHousePriceIndex =
      this.ihousePriceIndex.nominalHousePriceIndex.slice(startIndex);
    this.ihousePriceIndex.nominalRentPriceIndex =
      this.ihousePriceIndex.nominalRentPriceIndex.slice(startIndex);
    this.ihousePriceIndex.realHousePriceIndex =
      this.ihousePriceIndex.realHousePriceIndex.slice(startIndex);
    this.ihousePriceIndex.nominalHouseToRentIndex =
      this.ihousePriceIndex.nominalHouseToRentIndex.slice(startIndex);
    this.ihousePriceIndex.date = this.ihousePriceIndex.date.slice(startIndex);

    this.annualizedNominalHouseReturn = this.calculateAnnualizedReturn(
      this.ihousePriceIndex.nominalHousePriceIndex[
        this.ihousePriceIndex.nominalHousePriceIndex.length - 1
      ],
      this.ihousePriceIndex.nominalHousePriceIndex[0],
      this.ihousePriceIndex.nominalHousePriceIndex.length - 1,
    );
    this.annualizedRealHouseReturn = this.calculateAnnualizedReturn(
      this.ihousePriceIndex.realHousePriceIndex[
        this.ihousePriceIndex.realHousePriceIndex.length - 1
      ],
      this.ihousePriceIndex.realHousePriceIndex[0],
      this.ihousePriceIndex.realHousePriceIndex.length - 1,
    );
    this.annualizedNominalRentalReturn = this.calculateAnnualizedReturn(
      this.ihousePriceIndex.nominalRentPriceIndex[
        this.ihousePriceIndex.nominalRentPriceIndex.length - 1
      ],
      this.ihousePriceIndex.nominalRentPriceIndex[0],
      this.ihousePriceIndex.nominalRentPriceIndex.length - 1,
    );

    this.apexChart.updateOptions(this.createChartOption());
  }

  chosenStartYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.startDate.value;
    ctrlValue.year(normalizedYear.year());
    this.startDate.setValue(ctrlValue);
    datepicker.close();
  }

  private calculateAnnualizedReturn(
    finalValue: number,
    initialValue: number,
    duration: number,
  ): number {
    // annualized return, also known as the compound annual growth rate
    // CAGR = ( Final Value / Initial Investment  ) ^ (1 / Number of Years) − 1
    const returnPerAnnum = (Math.pow(finalValue / initialValue, 1 / duration) - 1) * 100;
    return Math.round((returnPerAnnum + Number.EPSILON) * 100) / 100;
  }

  private createChartOption() {
    return {
      series: [
        {
          name: this.translate.instant('PROPERTY_GROWTH_HOUSE_NOMINAL_PRICE_INDEX'),
          data: this.ihousePriceIndex.nominalHousePriceIndex,
        },
        {
          name: this.translate.instant('PROPERTY_GROWTH_HOUSE_REAL_PRICE_INDEX'),
          data: this.ihousePriceIndex.realHousePriceIndex,
        },
        {
          name: this.translate.instant('PROPERTY_GROWTH_RENT_NOMINAL_PRICE_INDEX'),
          data: this.ihousePriceIndex.nominalRentPriceIndex,
        },
        {
          name: this.translate.instant('PROPERTY_GROWTH_HOUSE_TO_RENT_NOMINAL_INDEX'),
          data: this.ihousePriceIndex.nominalHouseToRentIndex,
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
      stroke: {
        curve: 'smooth',
        width: [2, 2],
      },
      xaxis: {
        type: 'datetime',
        categories: this.ihousePriceIndex.date,
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
    };
  }
}
