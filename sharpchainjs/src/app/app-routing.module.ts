import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptingComponent } from './scripting/scripting.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    { path: 'scripting', component: ScriptingComponent },
    { path: 'dashboard', component: DashboardComponent },
    // { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: "dashboard" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }