import {Component} from '@angular/core';

@Component({
  selector: 'app-propertyaffordability',
  templateUrl: './propertyaffordability.component.html',
  styleUrls: ['./propertyaffordability.component.css'],
})
export class PropertyaffordabilityComponent {
  propertyPrice = 500000;
  monthlyIncome = 3500;
  monthlyRent = 1500;
  maintenanceCost = 1.5;
  historicalNominalPropertyReturn = 3.0;
  historicalNominalEquityReturn = 6.9;
  downpayment = 100000;
  interestRate = 7.0;
  closingCost = 10.0;
  propertyTax = 0;
  priceToIncomeRatio = 0;
  monthlyTotalCostOfPropertyOwnership = 0;
  monthlyMaximumTotalPayment = 0;
  priceToRentRatio = 0;

  onCalculateMonthlyPayment() {
    this.priceToIncomeRatio =
      Math.round((this.propertyPrice / (this.monthlyIncome * 12) + Number.EPSILON) * 100) / 100;
    this.priceToRentRatio =
      Math.round((this.propertyPrice / (this.monthlyRent * 12) + Number.EPSILON) * 100) / 100;

    const closingCostAbsolute = (this.closingCost * this.propertyPrice) / 100;
    const opportunityCost =
      ((this.historicalNominalEquityReturn - this.historicalNominalPropertyReturn) *
        (this.downpayment + closingCostAbsolute)) /
      100;
    const totalCostOfCapital =
      opportunityCost + ((this.propertyPrice - this.downpayment) * this.interestRate) / 100;
    this.monthlyTotalCostOfPropertyOwnership =
      ((this.propertyPrice - this.downpayment) *
        ((this.propertyPrice * (this.maintenanceCost + this.propertyTax)) / 100 +
          totalCostOfCapital)) /
      this.propertyPrice /
      12;

    this.monthlyTotalCostOfPropertyOwnership =
      Math.round((this.monthlyTotalCostOfPropertyOwnership + Number.EPSILON) * 100) / 100;

    this.monthlyMaximumTotalPayment =
      Math.round((this.monthlyIncome * 0.3 + Number.EPSILON) * 100) / 100;
  }
}
