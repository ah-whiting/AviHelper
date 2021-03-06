import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraphDisplayComponent } from './graph-display/graph-display.component'
import { CompassComponent } from './compass/compass.component';
import { TableDisplayComponent } from './table-display/table-display.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: ':version', component:AppComponent},
  { path: 'graph', component:GraphDisplayComponent},
  { path: 'compass', component:CompassComponent},
  { path: 'table', component:TableDisplayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
