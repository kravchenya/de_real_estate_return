import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import vpiIflationYear from 'src/assets/vpiiflationyear.json';
import vpiIflationMonthly from 'src/assets/vpiiflationmonthly.json';
import { IHistoricalInflation } from './ihistoricalinflation';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
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
  selector: 'app-pricecalculator',
  templateUrl: './pricecalculator.component.html',
  styleUrls: ['./pricecalculator.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class PricecalculatorComponent implements OnInit {

  maxDate: Date;
  minStartDate: Date;
  minEndDate: Date;
  dateEnd: FormControl;
  dateStart: FormControl = new FormControl(moment([1991, 0, 1]));
  purchasePrice: number = 100000;
  purchasePricePlaceHolder: string = "100000";
  purchasePriceAsString: string = "100000";
  interestRate: number = 2.00;
  isDateEndFormControllerValid: boolean = false;
  inflatedPurchasePrise: number = 0.0;
  inflatedPurchasePriseAsString: string = "";
  currentMarketPrise: number = 0.0;
  annualizedReturn: number = 0.0;
  overallReturn: number = 0.0;
  

  // ihistoricalInflation: IHistoricalInflation = {
  //   name: 'inflation',
  //   date: [],
  //   inflationChangeYoY: [],
  //   VpiIndex: []
  // };
  // maxEndDate: Date;

  constructor() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDay();

    this.minStartDate = new Date(1991, 0, 1);
    this.maxDate = currentDate;

    this.dateEnd = new FormControl(moment([currentYear, currentMonth, currentDay]));


    this.minEndDate = new Date(1991, 1, 1);

    this.getExtraExpenses();
  }

  chosenStartYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.dateStart.value;
    ctrlValue!.year(normalizedYear.year());
    this.dateStart.setValue(ctrlValue);
  }

  chosenEndYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.dateEnd.value;
    ctrlValue!.year(normalizedYear.year());
    this.dateEnd.setValue(ctrlValue);
  }

  chosenStartMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.dateStart.value;
    ctrlValue!.month(normalizedMonth.month());
    this.dateStart.setValue(ctrlValue);
    this.minEndDate = new Date(ctrlValue!.year(), ctrlValue!.month() + 1);
    datepicker.close();
  }

  chosenEndMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.dateEnd.value;
    ctrlValue!.month(normalizedMonth!.month());
    this.dateEnd.setValue(ctrlValue);
    datepicker.close();

    debugger;
    if (this.dateEnd.value.getFullYear() < this.dateStart.value.getFullYear()){
      this.isDateEndFormControllerValid = true;
    }
  }

  getExtraExpenses(): void {

    vpiIflationYear.forEach((_element) => {
      // this.ihistoricalInflation.date.push(element.Date);
      // this.ihistoricalInflation.inflationChangeYoY.push(parseFloat(element.InflationChangeYoY));
      // this.ihistoricalInflation.VpiIndex.push(parseFloat(element.VpiIndex));
    });
  }

  onCalculate() {
    // var inflatedPurchasePrise = this.purchasePrice;
    var strYear = this.dateStart.value!.year();
    var strMonth = this.dateStart.value!.month() + 2;
    // var strMonthIndex:string = '';
    // if (strMonth === 12){
    //   strMonthIndex = strYear + '-' + strMonth;
    // } else
    // {
    //   strMonthIndex = strYear + '-0' + strMonth;
    // }
    var strMonthIndex = strMonth === 12 ? strYear + '-' + strMonth :  strYear + '-0' + strMonth;
    var endMonthIndex = strYear + '-' + '12';
    this.inflatedPurchasePrise = this.calculatePurchasePriceMoM(strMonthIndex, endMonthIndex, this.purchasePrice);

    var startYearIndex = strYear + 2 + '-01'; 
    var endYear = this.dateEnd.value!.year();
    var endYearIndex = endYear + '-01'; 
    this.inflatedPurchasePrise = this.calculatePurchasePriceYoY(startYearIndex, endYearIndex, this.inflatedPurchasePrise);

    var endMonth = this.dateEnd.value!.month() + 1;

    // TODO seems error in the formulat - should be endYear instead of strYear; and endMonth instead of  strMonth
    var endYearFirstMonthIndex = endMonth === 12 ? strYear + '-' + strMonth :  strYear + '-0' + strMonth;
    var endYearLastMonthIndex = strYear + '-' + '12';
    this.inflatedPurchasePrise = this.calculatePurchasePriceMoM(endYearFirstMonthIndex, endYearLastMonthIndex, this.inflatedPurchasePrise);

    // this.inflatedPurchasePriseAsString = (Math.round(this.inflatedPurchasePrise * 100) / 100).toFixed(2);

    this.inflatedPurchasePrise = Math.round((this.inflatedPurchasePrise + Number.EPSILON) * 100) / 100;
    this.inflatedPurchasePriseAsString = this.inflatedPurchasePrise.toLocaleString();

    console.log(this.inflatedPurchasePrise);

    var t = this. purchasePrice;
    var p = this.interestRate;

    var s = this.dateStart;
    var e = this.dateEnd;

  }

  onCalculateReturn() {

    var strYear = this.dateStart.value!.year();
    var strMonth = this.dateStart.value!.month() + 1;
    var strYearMonth = strMonth === 1 ? 0 : strMonth/12;
    
    var endMonth = this.dateEnd.value!.month() + 1;
    var endYear = this.dateEnd.value!.year();
    var endYearMonth = endMonth === 12 ? 0 : endMonth/12;
    
    let duration = (endYear + endYearMonth) - (strYear + strYearMonth); 

    this.overallReturn = (this.currentMarketPrise - this.inflatedPurchasePrise) / this.currentMarketPrise;
    let propertyReturnFull = (Math.pow(1 + this.overallReturn, 1 / duration) - 1) * 100;  
    this.annualizedReturn = Math.round((propertyReturnFull + Number.EPSILON) * 100) / 100;
    this.overallReturn = Math.round((this.overallReturn + Number.EPSILON) * 100);
  }

  calculatePurchasePriceYoY(sIndex: string, eIndex: string, purchasePrise: number) : number {
    var startYearIndex = vpiIflationMonthly.findIndex(element =>  sIndex === element.Date);
    //var startYearIndex = vpiIflationYear.findIndex(element =>  sIndex === element.Date);
    var endYearIndex = vpiIflationMonthly.findIndex(element =>  eIndex === element.Date);
    //var endYearIndex = vpiIflationYear.findIndex(element =>  eIndex === element.Date);
    var inflatedPurchasePrise = purchasePrise;
    var iflationYoY = 0;
    for (var i = startYearIndex; i < endYearIndex; i=i+12) {

      iflationYoY = +(vpiIflationMonthly[i].InflationYoY!)/100;
      // var iflationYoY = +(vpiIflationYear[i].InflationChangeYoY)/100;
      inflatedPurchasePrise = inflatedPurchasePrise + inflatedPurchasePrise * iflationYoY;
      console.log(iflationYoY);
      console.log(inflatedPurchasePrise);
    }
    return inflatedPurchasePrise;

  }

  calculatePurchasePriceMoM(sIndex : string, eIndex : string, purchasePrice : number) : number {
    var startMonthIndex = vpiIflationMonthly.findIndex(element => sIndex === element.Date);
    var endMIndex = vpiIflationMonthly.findIndex(element => eIndex === element.Date);

    var iflationMoM = 0;
    for (var i = startMonthIndex; i <= endMIndex; i++) {
      iflationMoM = +(vpiIflationMonthly[i].InflationMoM!)/100;
      purchasePrice = purchasePrice + purchasePrice * iflationMoM;
      console.log(iflationMoM);
      console.log(purchasePrice);
    }
    return purchasePrice;
  }


  ngOnInit(): void {
  }

}
