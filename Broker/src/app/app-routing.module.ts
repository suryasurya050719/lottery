import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserReviewViewComponent } from './components/user-review-view/user-review-view.component';
import { UserReviewComponent } from './components/user-review/user-review.component';
import { WalletReivewComponent } from './components/wallet-review/wallet-review.component';
import { MainComponent } from './layout/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuardGuard } from '../guard/auth_guard/authGaurd';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookingReviewComponent } from './components/booking-review/booking-review.component';
import { BookingRecordsComponent } from './components/booking-records/booking-records.component';
import { GameCentreComponent } from './components/game-centre/game-centre.component';
// import { CreateLotteryComponent } from './components/create-lottery/create-lottery.component';
import { LotteryResultComponent } from './components/lottery-result/lottery-result.component';
import { WinningReportComponent } from './components/winning-report/winning-report.component';
import { TicketPriceDetailsComponent } from './components/ticket-price-details/ticket-price-details.component';
import { CustomerCareListComponent } from './components/customer-care-list/customer-care-list.component';
// import { CustomerCareAddComponent } from './components/customer-care-add/customer-care-add.component';
// import { OurInformationAddComponent } from './components/our-information-add/our-information-add.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageGaurd } from '../guard/page_gaurd/pageGaurd';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
// import { BookingReviewComponent } from './components/booking-review/booking-review.component';
import { WalletComponent } from '../app/components/wallet/wallet.component';
import { AccountAddComponent } from './components/account-add/account-add.component';
import { MyRequestComponent } from './components/my-request/my-request.component';
import { MyRequestApprovedComponent } from './components/my-request-approved/my-request-approved.component';
import { MyRequestRejectedComponent } from './components/my-request-rejected/my-request-rejected.component';

const routes: Routes = [
  // No Layouts
  {
    path: '',
    component: LoginComponent,
    // canActivate: [PageGaurd],
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [PageGaurd],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  //Main Layout
  {
    path: '',
    component: MainComponent,
    // canActivate: [AuthGuardGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'wallet',
        component: WalletComponent,
      },
      {
        path: 'wallet-review',
        component: WalletReivewComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'user-review',
        component: UserReviewComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'booking-review',
        component: BookingReviewComponent,
      },
      {
        path: 'booking-records',
        component: BookingRecordsComponent,
      },
      {
        path: 'game-centre',
        component: GameCentreComponent,
      },
      // {
      //   path: 'create-lottery',
      //   component: CreateLotteryComponent,
      // },
      {
        path: 'lottery-result',
        component: LotteryResultComponent,
      },
      {
        path: 'winning-report',
        component: WinningReportComponent,
      },
      {
        path: 'ticket-price-details',
        component: TicketPriceDetailsComponent,
      },
      {
        path: 'customer-care-list',
        component: CustomerCareListComponent,
      },
      {
        path:'my-request',
        component:MyRequestComponent
      },
      {
        path:'my-request-approved',
        component:MyRequestApprovedComponent
      },
      {
        path:'my-request-rejected',
        component:MyRequestRejectedComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'payment-profile',
        component: AccountAddComponent,
      },

      {
        path: 'user-review-view/:id',
        component: UserReviewViewComponent,
        canActivate: [AuthGuardGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
