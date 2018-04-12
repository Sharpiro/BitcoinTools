import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptingComponent } from './scripting/scripting.component';

const routes: Routes = [
    { path: 'scripting', component: ScriptingComponent },
    // { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: "" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }