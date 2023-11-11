import {Component, OnInit} from '@angular/core';
import {IHistoricalRate} from '../services/shareddataservice/ihistoricalrate';
import {TranslateService} from '@ngx-translate/core';
import {SharedDataService} from '../services/shareddataservice/shareddata.service';
import {Observable, combineLatest, map, of, switchMap} from 'rxjs';

interface TranslatedTexts {
  'GLOBALMARKETRETURN_MSCI_GRAPH_TITLE': string;
  'GLOBALMARKETRETURN_MSCI_NOMINAL_DATA_SERIES': string;
  'GLOBALMARKETRETURN_MSCI_REAL_DATA_SERIES': string;
}

@Component({
  selector: 'app-globalmarketreturn',
  templateUrl: './globalmarketreturn.component.html',
  styleUrls: ['./globalmarketreturn.component.css'],
})
export class GlobalMarketReturnComponent implements OnInit {
  msciDevelopmentNominal: IHistoricalRate = {
    date: [],
    rate: [],
  };
  msciDevelopmentReal: IHistoricalRate = {
    date: [],
    rate: [],
  };

  overallAbsolutReturnReal$: Observable<number> = new Observable<number>();
  overallAbsolutReturnNominal$: Observable<number> = new Observable<number>();
  annualizedReturnReal$: Observable<number> = new Observable<number>();
  annualizedReturnNominal$: Observable<number> = new Observable<number>();
  monthlyPayment$: Observable<number> = new Observable<number>();
  totalExpenseRatio = 0.0;
  transactionCost$: Observable<number> = new Observable<number>();
  transactionCost = 0.0;

  constructor(
    private translate: TranslateService,
    private sharedService: SharedDataService,
  ) {}

  ngOnInit(): void {
    const chartOptions = {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      series: [],
      stroke: {
        curve: 'smooth',
        width: [2, 2],
      },
      tooltip: {
        x: {
          format: 'MM.yyyy',
        },
      },
      xaxis: {
        type: 'datetime',
        categories: this.msciDevelopmentReal.date,
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return (Math.round(value * 100) / 100).toFixed(2);
          },
        },
      },
    };

    const apexChart = new ApexCharts(
      document.querySelector('#globalMarketReturnChart'),
      chartOptions,
    );
    apexChart.render();

    const globalmarketreturnTexts = [
      'GLOBALMARKETRETURN_MSCI_GRAPH_TITLE',
      'GLOBALMARKETRETURN_MSCI_NOMINAL_DATA_SERIES',
      'GLOBALMARKETRETURN_MSCI_REAL_DATA_SERIES',
    ];

    this.translate.get(globalmarketreturnTexts).subscribe((translatedTexts) => {
      apexChart.updateOptions(this.initOptions(translatedTexts));
    });

    this.translate.onLangChange.subscribe(() => {
      this.translate.get(globalmarketreturnTexts).subscribe((translatedTexts) => {
        apexChart.updateOptions(this.initOptions(translatedTexts));
      });
    });

    this.getMcsiAcwiData(apexChart);
  }

  private initOptions(translatedTexts: TranslatedTexts) {
    return {
      title: {
        text: translatedTexts.GLOBALMARKETRETURN_MSCI_GRAPH_TITLE,
        align: 'center',
      },
      series: [
        {
          name: translatedTexts.GLOBALMARKETRETURN_MSCI_NOMINAL_DATA_SERIES,
          data: this.msciDevelopmentNominal.rate,
        },
        {
          name: translatedTexts.GLOBALMARKETRETURN_MSCI_REAL_DATA_SERIES,
          data: this.msciDevelopmentReal.rate,
        },
      ],
    };
  }

  private getMcsiAcwiData(apexChart: ApexCharts): void {
    this.transactionCost$ = this.sharedService.transactionCost$.pipe(map((value) => value));

    this.monthlyPayment$ = this.sharedService.monthlyPayment$.pipe(map((value) => value));

    this.annualizedReturnNominal$ = this.sharedService.annualizedReturnNominal$.pipe(
      map((value) => value),
    );

    this.annualizedReturnReal$ = this.sharedService.annualizedReturnReal$.pipe(
      map((value) => value),
    );

    this.annualizedReturnNominal$ = this.sharedService.annualizedReturnNominal$.pipe(
      map((value) => value),
    );

    this.overallAbsolutReturnNominal$ = this.sharedService.overallAbsolutReturnNominal$.pipe(
      map((value) => value),
    );

    this.overallAbsolutReturnReal$ = combineLatest([
      this.sharedService.overallAbsolutReturnReal$,
      this.sharedService.msciDevelopmentReal$,
      this.sharedService.msciDevelopmentNominal$,
    ]).pipe(
      switchMap(([overallAbsolutReturnReal, msciDevelopmentReal, msciDevelopmentNominal]) => {
        this.msciDevelopmentReal = msciDevelopmentReal;
        this.msciDevelopmentNominal = msciDevelopmentNominal;
        apexChart.updateOptions({
          series: [
            {
              name: this.translate.instant('GLOBALMARKETRETURN_MSCI_NOMINAL_DATA_SERIES'),
              data: this.msciDevelopmentNominal.rate,
            },
            {
              name: this.translate.instant('GLOBALMARKETRETURN_MSCI_REAL_DATA_SERIES'),
              data: this.msciDevelopmentReal.rate,
            },
          ],
          xaxis: {
            type: 'datetime',
            categories: this.msciDevelopmentReal.date,
          },
        });
        return of(overallAbsolutReturnReal);
      }),
    );
  }

  onBlur(event: FocusEvent): void {
    const newTransactionCost = (event?.target as HTMLInputElement).value;
    if (newTransactionCost.match(/[^$,.\d]/) || newTransactionCost === '') {
      return;
    }
    this.sharedService.updateCalculatedMsciData(+newTransactionCost, this.totalExpenseRatio);
  }

  private calculateTer(): number {
    // p is TER per month as we have DCA and invest every month, i.e TER p.a. is 1% means TER p. month is 1% / 12 /100 in decemal
    // t is Number of monthly investments;
    // k is coefficient for a year prortion i.e. 1/12, 2/12, 3/12, ... , 12/12
    // M is total invested amount + invested every month sum of money
    // Sum i= 1..t, k=1..12 (k / 12 * P * M))
    return 0.0;
  }
}
