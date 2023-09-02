import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgApexchartsModule} from 'ng-apexcharts';

import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PricecalculatorComponent} from './pricecalculator/pricecalculator.component';
import {AdditionalCostComponent} from './additionalcost/additionalcost.component';
import {CreditcostComponent} from './creditcost/creditcost.component';
import {CountrymapComponent} from './countrymap/countrymap.component';
import {InflationComponent} from './inflation/inflation.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {GlobalMarketReturnComponent} from './globalmarketreturn/globalmarketreturn.component';
import {CitystatisticsComponent} from './citystatistics/citystatistics.component';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AdditionalCostComponent,
    AppComponent,
    CitystatisticsComponent,
    CountrymapComponent,
    CreditcostComponent,
    GlobalMarketReturnComponent,
    InflationComponent,
    PricecalculatorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,
    NoopAnimationsModule,

    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTabsModule,
    MatTableModule,

    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
