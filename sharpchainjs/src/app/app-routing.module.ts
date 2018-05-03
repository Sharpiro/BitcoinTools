import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptingComponent } from './scripting/scripting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Base58checkComponent } from './base58check/base58check.component';
import { SignatureComponent } from './signature/signature.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
    { path: 'scripting', component: ScriptingComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'base58check', component: Base58checkComponent },
    { path: 'signature', component: SignatureComponent },
    { path: 'wallet', component: WalletComponent },
    { path: '**', redirectTo: "dashboard" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }