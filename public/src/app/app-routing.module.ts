import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraphDisplayComponent } from './graph-display/graph-display.component'
import { CompassComponent } from './compass/compass.component';


const routes: Routes = [
  { path: '', component:GraphDisplayComponent},
  { path: 'compass', component:CompassComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
