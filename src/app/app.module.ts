import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from "ng-apexcharts";

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PricecalculatorComponent } from './pricecalculator/pricecalculator.component';
import { AdditionalCostComponent } from './additionalcost/additionalcost.component';
import { CreditcostComponent } from './creditcost/creditcost.component';
import { CountrymapComponent } from './countrymap/countrymap.component';
import { InflationComponent } from './inflation/inflation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { GlobalMarketReturnComponent } from './globalmarketreturn/globalmarketreturn.component';
import { CitystatisticsComponent } from './citystatistics/citystatistics.component';

@NgModule({
  declarations: [
    AppComponent,
    PricecalculatorComponent,
    AdditionalCostComponent,
    CreditcostComponent,
    CountrymapComponent,
    InflationComponent,
    GlobalMarketReturnComponent,
    CitystatisticsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgApexchartsModule,

    FormsModule,
    NoopAnimationsModule,
    
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,

    MatGridListModule,
    MatCardModule,

    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
