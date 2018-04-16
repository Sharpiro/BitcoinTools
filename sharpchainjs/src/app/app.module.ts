import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { WebWorkerService } from "angular2-web-worker"
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule, MatToolbarModule, MatInputModule } from '@angular/material';
import { ScriptingComponent } from './scripting/scripting.component';
import { ScriptingService } from './scripting/scripting.service';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Base58checkComponent } from './base58check/base58check.component';


@NgModule({
  declarations: [
    AppComponent,
    ScriptingComponent,
    DashboardComponent,
    Base58checkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [
    WebWorkerService,
    ScriptingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
