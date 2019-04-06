import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
// import { PapaParseModule} from 'ngx-papaparse'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphDisplayComponent } from './graph-display/graph-display.component'

import { NwacCsvService} from './nwac-csv.service';
import { CompassComponent } from './compass/compass.component';
import { TableDisplayComponent } from './table-display/table-display.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphDisplayComponent,
    CompassComponent,
    TableDisplayComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
    // PapaParseModule
  ],
  providers: [NwacCsvService],
  bootstrap: [AppComponent]
})
export class AppModule { }
