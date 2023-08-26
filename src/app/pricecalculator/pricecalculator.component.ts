import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import vpiInflationMonthly from '../../assets/vpiinflationmonthly.json';
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

  creditAmount: number = 100000;
  downPayment: number = 20000;
  isDateEndFormControllerInvalid: boolean[] = [];
  totalPriceReal: number = 0.0;
  marketPrice: number = 300000.0;
  totalCreditCost: number = 0.0;
  totalInterestPaid: number = 0.0;
  annualizedRealReturn: number = 0.0;
  overallRealReturn: number = 0.0;

  private currentDate: Date = new Date();

  creditDataList: ICreditData[] = [];

  ngOnInit(): void {
    const creditDataItem: ICreditData = {
      annualPercentageRate: 5.0,
      minStartDate: new Date(1991, 0, 1),
      minEndDate: new Date(1991, 1, 1),
      maxEndDate: this.currentDate,
      // startDate: new FormControl(moment([1991, 0, 1])),
      startDate: new FormControl(moment([1991, 0, 1])),
      // endDate: new FormControl(moment([this.currentDate.getFullYear(), this.currentDate.getMonth(), 1])),
      endDate: new FormControl(moment([2020, 11, 1])),
      closingCost: 10000,
    };

    this.creditDataList.push(creditDataItem);
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
  }

  onClosed(index: number) {

    var endDate = new Date(this.creditDataList[index].endDate.value);
    var startDate = new Date(this.creditDataList[index].startDate.value);

    var endMonth = endDate.getMonth();
    var endYear = endDate.getFullYear();
    var startYear = startDate.getFullYear();
    var startMonth = startDate.getMonth();
    if (endYear < startYear) {
      this.isDateEndFormControllerInvalid[index] = true;
      return;
    }

    if ((endYear === startYear) && (endMonth <= startMonth)) {
      this.isDateEndFormControllerInvalid[index] = true;
      return;
    }

    this.isDateEndFormControllerInvalid[index] = false;

    this.totalPriceReal = 0;
    this.totalCreditCost = 0;
  }

  onAddAdditionalFinancing() {
    const creditDataItem: ICreditData = {
      annualPercentageRate: 5.0,
      minStartDate: new Date(1991, 0, 1),
      minEndDate: new Date(1991, 1, 1),
      startDate: new FormControl(moment([1991, 0, 1])),
      endDate: new FormControl(moment([this.currentDate.getFullYear(), this.currentDate.getMonth(), 1])),
      maxEndDate: this.currentDate,
      closingCost: 10000,
    }
    this.creditDataList.push(creditDataItem);

    this.isDateEndFormControllerInvalid.push(false);
  }

  onDeleteAdditionalFinancing() {
    if (this.creditDataList.length > 1) {
      this.creditDataList.pop();
      this.isDateEndFormControllerInvalid.pop();
    }
  }

  onCalculateInflationAdjustedPrice() {
    this.annualizedRealReturn = 0;
    this.overallRealReturn = 0;
    this.totalPriceReal = 0;

    this.creditDataList.forEach(creditData => {

      const startIndexLocalTimezoneTimestapm = this.getIndex(creditData.startDate.value);
      const startIndex = vpiInflationMonthly.findIndex(vpiInflation => new Date(vpiInflation.Date).getTime() === startIndexLocalTimezoneTimestapm);
      const endIndexLocalTimezoneTimestapm = this.getIndex(creditData.endDate.value);
      const endIndex = vpiInflationMonthly.findIndex(vpiInflation => new Date(vpiInflation.Date).getTime() === endIndexLocalTimezoneTimestapm);

      const totalNumberPayments = endIndex - startIndex + 1;
      const monthlyInterest = this.calculateMonthlyInterest(this.creditAmount, creditData.annualPercentageRate, totalNumberPayments);
      this.totalCreditCost = Math.round((monthlyInterest * totalNumberPayments + Number.EPSILON) * 100) / 100;
      this.totalInterestPaid = Math.round((this.totalCreditCost - this.creditAmount + Number.EPSILON) * 100) / 100;

      var monthlyPayments = monthlyInterest; // in the very first month we do not have inflation MoM, therefore i = startIndex + 1 we start from index + 1, however we have a still initial payment
      var totalInitialPaymant = creditData.closingCost + this.downPayment;
      for (var i = startIndex + 1; i <= endIndex; i++) {
        // we do not apply inflation for the  monthly interest at the current month, but to previous month cause inflation is Month-over-Month
        monthlyPayments = monthlyPayments * (1 + vpiInflationMonthly[i].InflationMoM / 100) + monthlyInterest;
        totalInitialPaymant = totalInitialPaymant * (1 + vpiInflationMonthly[i].InflationMoM / 100);
      }

      this.totalPriceReal = Math.round((totalInitialPaymant + monthlyPayments + Number.EPSILON) * 100) / 100;
    });
  }

  calculateMonthlyInterest(creditAmount: number, effectiveAnnualRate: number, creditDarutionInMonth: number): number {

    // i_nominal_rate ​= (1 + r_effektiv_annual_rate_as_decimal​) ^ 1/n − 1
    // Where:
    // i_nominal_rate is "periodic interest rate" or "nominal interest rate"
    // n number of interest payment per year (i.e. 12 for monthly payments)
    // var nominalInterestRate = Math.pow(1 + effectiveAnnualRate/100, 1/12) - 1 // compaund way to calculate interest rate paid monthly
    const nominalInterestRate = effectiveAnnualRate / 100 / 12 // simple way to calculate interest rate paid monthly

    // Credit cost Z = P × (r x (1 + r)^n) / ((1+r)^n−1) 
    // Where: 
    // Z is cost of credit over total credit duration. Also see "Amortization Schedule" for reference
    // P is credit amount (initial sum of money borrowed from a bank)
    // r is periodic (nominal) interest rate
    // n is total amount of interest payment periods

    return creditAmount
      * nominalInterestRate * Math.pow(1 + nominalInterestRate, creditDarutionInMonth) / (Math.pow(1 + nominalInterestRate, creditDarutionInMonth) - 1);
  }

  onCalculateReturn() {
    this.creditDataList.forEach(creditData => {
      const startIndexLocalTimezoneTimestapm = this.getIndex(creditData.startDate.value);
      const startIndex = vpiInflationMonthly.findIndex(vpiInflation => new Date(vpiInflation.Date).getTime() === startIndexLocalTimezoneTimestapm);
      const endIndexLocalTimezoneTimestapm = this.getIndex(creditData.endDate.value);
      const endIndex = vpiInflationMonthly.findIndex(vpiInflation => new Date(vpiInflation.Date).getTime() === endIndexLocalTimezoneTimestapm);

      const totalNumberPaymentsInYears = (endIndex - startIndex + 1) / 12; // in case credit duration is of form 15 years and 2 months

      this.overallRealReturn = (this.marketPrice - this.totalPriceReal) / this.totalPriceReal;
      this.overallRealReturn = Math.round((this.overallRealReturn + Number.EPSILON) * 100);

      // annualized return, also known as the compound annual growth rate
      // CAGR = ( Final Value / Initial Investment ​) ^ (1 / Number of Years) − 1
      this.annualizedRealReturn = (Math.pow(this.marketPrice / this.totalPriceReal, 1 / totalNumberPaymentsInYears) - 1) * 100;
      this.annualizedRealReturn = Math.round((this.annualizedRealReturn + Number.EPSILON) * 100) / 100;
    });
  }

  private getIndex(date: any) {

    const timeZoneOffsetStart = date.toDate().getTimezoneOffset();
    const indexLocalTimezoneTimestapm = timeZoneOffsetStart > 0 ? date.valueOf() + 60000 * timeZoneOffsetStart : date.valueOf() - 60000 * timeZoneOffsetStart;
    return indexLocalTimezoneTimestapm;
  }
}
