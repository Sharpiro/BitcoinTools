import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatCardModule, MatInputModule, MatTableModule, MatSortModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoinGridComponent } from './coin-grid/coin-grid.component';
import { CoinGridApiService } from './coin-grid/coin-grid-api.service';
import { coinGridServiceToken } from './coin-grid/coin-grid.interfaces';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    CoinGridComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule 
  ],
  providers: [
    { provide: coinGridServiceToken, useClass: CoinGridApiService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }