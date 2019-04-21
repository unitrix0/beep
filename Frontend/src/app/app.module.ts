import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ScanComponent } from './scan/scan.component';
import {FormsModule} from '@angular/forms';
import { ScanCardComponent } from './scan/scan-card/scan-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ScanComponent,
    ScanCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
