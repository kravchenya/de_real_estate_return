import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from "ng-apexcharts";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PricecalculatorComponent } from './pricecalculator/pricecalculator.component';
import { AdditionalCostComponent } from './additionalcost/additionalcost.component';
import { CreditcostComponent } from './creditcost/creditcost.component';
import { CountrymapComponent } from './countrymap/countrymap.component';
import { InflationComponent } from './inflation/inflation.component';

@NgModule({
  declarations: [
    AppComponent,
    PricecalculatorComponent,
    AdditionalCostComponent,
    CreditcostComponent,
    CountrymapComponent,
    InflationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
