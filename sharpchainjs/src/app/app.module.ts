import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { WebWorkerService } from "angular2-web-worker"
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule, MatToolbarModule, MatInputModule, MatCheckboxModule } from '@angular/material';
import { ScriptingComponent } from './scripting/scripting.component';
import { ScriptingService } from './scripting/scripting.service';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Base58checkComponent } from './base58check/base58check.component';
import { SignatureComponent } from './signature/signature.component';
import { HexValidationDirective } from './shared/hex-validation/hex-validation.directive';

@NgModule({
  declarations: [
    AppComponent,
    ScriptingComponent,
    DashboardComponent,
    Base58checkComponent,
    SignatureComponent,
    HexValidationDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatCheckboxModule,
    BrowserAnimationsModule
  ],
  providers: [
    WebWorkerService,
    ScriptingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
