import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WebWorkerService } from "angular2-web-worker"


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [WebWorkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
