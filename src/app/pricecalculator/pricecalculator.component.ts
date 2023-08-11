import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import vpiIflationYear from 'src/assets/vpiinflationyear.json';
import vpiInflationMonthly from 'src/assets/vpiinflationmonthly.json';
import { ICreditData } from './icreditdata';


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

  purchasePrice: number = 100000;
  downPayment: number = 20000;
  closingCost: number = 10000;
  isDateEndFormControllerValid: boolean = false;
  inflatedPurchasePrice: number = 0.0;
  marketPrice: number = 300000.0;
  annualizedReturn: number = 0.0;
  overallReturn: number = 0.0;

  private currentDate: Date = new Date();

  creditDataList: ICreditData[] = [];

  ngOnInit(): void {
    const creditDataItem: ICreditData = {
      annualPercentageRate: 5.0,

      minStartDate: new Date(1991, 0, 1),
      minEndDate: new Date(1991, 1, 1),
      startDate: new FormControl(moment([1991, 0, 1])),
      endDate: new FormControl(moment([this.currentDate.getFullYear(), this.currentDate.getMonth(), 1])),
      maxEndDate: this.currentDate,
    };

    this.creditDataList.push(creditDataItem);

    this.getExtraExpenses();
  }

  chosenStartYearHandler(normalizedYear: Moment, index: number) {
    const ctrlValue = this.creditDataList[index].startDate.value;
    ctrlValue!.year(normalizedYear.year());
    this.creditDataList[index].startDate.setValue(ctrlValue);
  }

  chosenEndYearHandler(normalizedYear: Moment, index: number) {
    const ctrlValue = this.creditDataList[index].endDate.value;
    ctrlValue!.year(normalizedYear.year());
    this.creditDataList[index].endDate.setValue(ctrlValue);
  }

  chosenStartMonthHandler(normalizedMonth: Moment, index: number, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.creditDataList[index].startDate.value;
    ctrlValue!.month(normalizedMonth.month());
    this.creditDataList[index].startDate.setValue(ctrlValue);
    this.creditDataList[index].minEndDate = new Date(ctrlValue!.year(), ctrlValue!.month() + 1);
    datepicker.close();
  }

  chosenEndMonthHandler(normalizedMonth: Moment, index: number, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.creditDataList[index].endDate.value;
    ctrlValue!.month(normalizedMonth!.month());
    this.creditDataList[index].endDate.setValue(ctrlValue);
    datepicker.close();

    if (this.creditDataList[index].endDate.value.getFullYear() < this.creditDataList[index].startDate.value.getFullYear()) {
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

  onAddAdditionalFinancing() {
    const creditDataItem: ICreditData = {
      annualPercentageRate: 5.0,
      minStartDate: new Date(1991, 0, 1),
      minEndDate: new Date(1991, 1, 1),
      startDate: new FormControl(moment([1991, 0, 1])),
      endDate: new FormControl(moment([this.currentDate.getFullYear(), this.currentDate.getMonth(), 1])),
      maxEndDate: this.currentDate,
    }
    this.creditDataList.push(creditDataItem);
  }

  onDeleteAdditionalFinancing() {
    if (this.creditDataList.length > 1) {
      this.creditDataList.pop();
    }
  }

  onCalculateInflationAdjustedPrice() {
    this.inflatedPurchasePrice = 0;

    this.creditDataList.forEach(creditData => {
      var inflatedPurchasePrise = 0;
      var inflationAdjustedMonthRatesSum = 0;
      var strYear = creditData.startDate.value!.year();

      // Calculate MoM inflated price for the first year
      var strMonth = creditData.startDate.value!.month() + 2; // +2 cause index starts from 0/January ... 11/Dezember and we want to calculate inflation from the following month
      if (strMonth <= 12) {
        var strMonthIndex = strMonth.toString().length === 2 ? strYear + '-' + strMonth : strYear + '-0' + strMonth;
        var endMonthIndex = strYear + '-' + '12';
        inflatedPurchasePrise = this.calculatePurchasePriceMoM(strMonthIndex, endMonthIndex, this.purchasePrice);
        inflationAdjustedMonthRatesSum = this.calculateAnnualPercentageRateMoM(strMonthIndex, endMonthIndex, this.purchasePrice, creditData.annualPercentageRate);
      }

      // Calculate YoY inflated price from the second year till january of the last year
      var startYearIndex = strYear + 1 + '-01';
      var endYear = creditData.endDate.value!.year();
      var endYearIndex = endYear + '-01';
      inflatedPurchasePrise = this.calculatePurchasePriceYoY(startYearIndex, endYearIndex, inflatedPurchasePrise);
      inflationAdjustedMonthRatesSum = inflationAdjustedMonthRatesSum + this.calculateAnnualPercentageRateYoY(startYearIndex, endYearIndex, this.purchasePrice, creditData.annualPercentageRate)

      // Calculate MoM inflated price for the last year
      var endMonth = creditData.endDate.value!.month() + 1;
      if (endMonth != 1) {
        var endYearFirstMonthIndex = endYear + '-02'; // 2 is here, cause we calculated "endYear + '-01'" already for YoY
        var endYearLastMonthIndex = endMonth.toString().length === 2 ? endYear + '-' + strMonth : endYear + '-0' + strMonth;
        inflatedPurchasePrise = this.calculatePurchasePriceMoM(endYearFirstMonthIndex, endYearLastMonthIndex, inflatedPurchasePrise);
        inflationAdjustedMonthRatesSum = inflationAdjustedMonthRatesSum + this.calculateAnnualPercentageRateMoM(endYearFirstMonthIndex, endYearLastMonthIndex, this.purchasePrice, creditData.annualPercentageRate);
      }
      this.inflatedPurchasePrice = inflatedPurchasePrise + inflationAdjustedMonthRatesSum;
    });

    // case when credit has been payed off some time ago
    var length = this.creditDataList.length - 1;
    var endYear = this.creditDataList[length].endDate.value!.year();
    var endMonth = this.creditDataList[length].endDate.value!.month() + 2;
    var currentYear = this.currentDate.getFullYear();
    var currentMonth = this.currentDate.getMonth() + 1;

    if (endYear < currentYear || ((endYear === currentYear) && (endMonth < currentMonth))) {

      // Calculate MoM inflated price for the first year
      var strMonthIndex = endMonth.toString().length === 2 ? endYear + '-' + endMonth : endYear + '-0' + endMonth;
      var endMonthIndex = currentMonth.toString().length === 2 ? endYear + '-' + currentMonth : endYear + '-0' + currentMonth;
      var inflatedPrise = this.calculatePurchasePriceMoM(strMonthIndex, endMonthIndex, this.inflatedPurchasePrice);

      // Calculate YoY inflated price from the second year till january of the last year
      if (endYear != currentYear) {
        var startYearIndex = endYear + 1 + '-01';
        var endYearIndex = currentYear + '-01';
        inflatedPrise = this.calculatePurchasePriceYoY(startYearIndex, endYearIndex, inflatedPrise);
      }

      // Calculate MoM inflated price for the last year
      if (endYear != currentYear && currentMonth != 1) {
        var endYearFirstMonthIndex = currentYear + '-02';;
        var endYearLastMonthIndex = currentYear + '-' + currentMonth;
        inflatedPrise = this.calculatePurchasePriceMoM(endYearFirstMonthIndex, endYearLastMonthIndex, inflatedPrise);
      }

      this.inflatedPurchasePrice = this.inflatedPurchasePrice + inflatedPrise;
    }

    // Calculate closing costs and downpayment inflation adjusted prices
    var strYear = this.creditDataList[0].startDate.value!.year();
    var strMonth = this.creditDataList[0].startDate.value!.month() + 2;

    var strMonthIndex = currentMonth.toString().length === 2 ? strYear + '-' + strMonth : strYear + '-0' + strMonth;
    var endMonthIndex = strYear + '-' + '12';

    var startYearIndex = strYear + 1 + '-01';
    var endYearIndex = currentYear + '-01';

    var endYearFirstMonthIndex = currentYear + '-02';
    var endYearLastMonthIndex = currentYear + '-' + currentMonth;

    var downPaymentAdjusted = this.CalculatedInflationAdjustedPrice(this.downPayment, strMonthIndex, endMonthIndex,
      startYearIndex, endYearIndex, endYearFirstMonthIndex, endYearLastMonthIndex);
    var closingCostAdjusted = this.CalculatedInflationAdjustedPrice(this.closingCost, strMonthIndex, endMonthIndex,
      startYearIndex, endYearIndex, endYearFirstMonthIndex, endYearLastMonthIndex);
    this.inflatedPurchasePrice = this.inflatedPurchasePrice + downPaymentAdjusted + closingCostAdjusted;

    this.inflatedPurchasePrice = Math.round((this.inflatedPurchasePrice + Number.EPSILON) * 100) / 100;
  }

  calculateAnnualPercentageRateYoY(sIndex: string, eIndex: string, purchasePrice: number, annualPercentageRate: number): number {
    var startYearIndex = vpiInflationMonthly.findIndex(element => sIndex === element.Date);
    //var startYearIndex = vpiIflationYear.findIndex(element =>  sIndex === element.Date);
    var endYearIndex = vpiInflationMonthly.findIndex(element => eIndex === element.Date);
    //var endYearIndex = vpiIflationYear.findIndex(element =>  eIndex === element.Date);
    
    var iflationYoY = 0;
    var inflationAdjustedYearlyRate = 0;
    // (Kreditbetrag x Zinssatz)
    var yearlyPaymentForApr = (purchasePrice * annualPercentageRate / 100);
    for (var i = startYearIndex; i < endYearIndex; i = i + 12) {
      iflationYoY = +(vpiInflationMonthly[i].InflationYoY!) / 100;
      // var iflationYoY = +(vpiIflationYear[i].InflationChangeYoY)/100;
      inflationAdjustedYearlyRate = inflationAdjustedYearlyRate + yearlyPaymentForApr + yearlyPaymentForApr * iflationYoY;
    }
    return inflationAdjustedYearlyRate;
  }

  calculateAnnualPercentageRateMoM(sIndex: string, eIndex: string, purchasePrice: number, annualPercentageRate: number): number {
    var startMonthIndex = vpiInflationMonthly.findIndex(element => sIndex === element.Date);
    var endMonthIndex = vpiInflationMonthly.findIndex(element => eIndex === element.Date);

    // There is no inflation data for give year and/or month
    if (startMonthIndex === -1) {
      startMonthIndex = vpiInflationMonthly.length - 1;
      return 0;
    }

    // There is no inflation data for give year and/or month
    if (endMonthIndex === -1) {
      endMonthIndex = vpiInflationMonthly.length - 1;
    }

    
    var inflationMoM = 0;
    var inflationAdjustedMonthRate = 0;
    // (Kreditbetrag x Zinssatz) ÷ (100 x 12)
    var monthlyPaymentForApr = (purchasePrice * annualPercentageRate / 100) / 100 * 12;
    for (var i = startMonthIndex; i <= endMonthIndex; i++) {
      inflationMoM = +(vpiInflationMonthly[i].InflationMoM!) / 100;
      inflationAdjustedMonthRate = inflationAdjustedMonthRate + monthlyPaymentForApr + monthlyPaymentForApr * inflationMoM;
    }
    return inflationAdjustedMonthRate;
  }

  private CalculatedInflationAdjustedPrice(priceToAdjust: number, strMonthIndex: string, endMonthIndex: string,
    startYearIndex: string, endYearIndex: string,
    endYearFirstMonthIndex: string, endYearLastMonthIndex: string): number {

    var inlfationAdjustedPrice = this.calculatePurchasePriceMoM(strMonthIndex, endMonthIndex, priceToAdjust);
    inlfationAdjustedPrice = this.calculatePurchasePriceYoY(startYearIndex, endYearIndex, inlfationAdjustedPrice);
    inlfationAdjustedPrice = this.calculatePurchasePriceMoM(endYearFirstMonthIndex, endYearLastMonthIndex, inlfationAdjustedPrice)
    return inlfationAdjustedPrice;
  }

  onCalculateReturn() {
    var strYear = this.creditDataList[0].startDate.value!.year();
    var strMonth = this.creditDataList[0].startDate.value!.month() + 1;
    var strYearMonth = strMonth === 1 ? 0 : strMonth / 12;
    var timeSeriesLength = this.creditDataList.length - 1;
    var endMonth = this.creditDataList[timeSeriesLength].endDate.value!.month() + 1;
    var endYear = this.creditDataList[timeSeriesLength].endDate.value!.year();
    var endYearMonth = endMonth === 12 ? 0 : endMonth / 12;

    let duration = (endYear + endYearMonth) - (strYear + strYearMonth);

    this.overallReturn = (this.marketPrice - this.inflatedPurchasePrice) / this.marketPrice;
    let propertyReturnFull = (Math.pow(1 + this.overallReturn, 1 / duration) - 1) * 100;
    this.annualizedReturn = Math.round((propertyReturnFull + Number.EPSILON) * 100) / 100;
    this.overallReturn = Math.round((this.overallReturn + Number.EPSILON) * 100);
  }

  calculatePurchasePriceYoY(sIndex: string, eIndex: string, purchasePrise: number): number {
    var startYearIndex = vpiInflationMonthly.findIndex(element => sIndex === element.Date);
    //var startYearIndex = vpiIflationYear.findIndex(element =>  sIndex === element.Date);
    var endYearIndex = vpiInflationMonthly.findIndex(element => eIndex === element.Date);
    //var endYearIndex = vpiIflationYear.findIndex(element =>  eIndex === element.Date);
    var iflationYoY = 0;
    for (var i = startYearIndex; i < endYearIndex; i = i + 12) {

      iflationYoY = +(vpiInflationMonthly[i].InflationYoY!) / 100;
      // var iflationYoY = +(vpiIflationYear[i].InflationChangeYoY)/100;
      purchasePrise = purchasePrise + purchasePrise * iflationYoY;
    }
    return purchasePrise;
  }

  calculatePurchasePriceMoM(sIndex: string, eIndex: string, purchasePrice: number): number {
    var startMonthIndex = vpiInflationMonthly.findIndex(element => sIndex === element.Date);
    var endMonthIndex = vpiInflationMonthly.findIndex(element => eIndex === element.Date);

    // There is no inflation data for give year and/or month
    if (startMonthIndex === -1) {
      startMonthIndex = vpiInflationMonthly.length - 1;
      return 0;
    }

    // There is no inflation data for give year and/or month
    if (endMonthIndex === -1) {
      endMonthIndex = vpiInflationMonthly.length - 1;
    }

    var inflationMoM = 0;
    for (var i = startMonthIndex; i <= endMonthIndex; i++) {
      inflationMoM = +(vpiInflationMonthly[i].InflationMoM!) / 100;
      purchasePrice = purchasePrice + purchasePrice * inflationMoM;
    }
    return purchasePrice;
  }
}
