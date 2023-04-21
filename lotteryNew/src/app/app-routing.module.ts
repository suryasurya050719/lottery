import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LotteryHomeComponent} from '../app/components/lottery-home/lottery-home.component'

const routes: Routes = [
  // No Layouts
  {
    path: '',
    component: LotteryHomeComponent,
    // canActivate: [PageGaurd],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
