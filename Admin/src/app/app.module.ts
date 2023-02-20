import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './layout/main/main.component';
import { HeaderComponent } from './layout/header/header.component';
import { AsideComponent } from './layout/aside/aside.component';
import { LoginComponent } from './components/login/login.component';
import { UserReviewViewComponent } from './components/user-review-view/user-review-view.component';
import { WalletReivewComponent } from './components/wallet-review/wallet-review.component';
import { UserReviewComponent } from './components/user-review/user-review.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { WalletComponent } from './components/wallet/wallet.component';
// import { CreateLotteryComponent } from './components/create-lottery/create-lottery.component';
import { AccountAddComponent } from './components/account-add/account-add.component';
import { OurInformationListComponent } from './components/our-information-list/our-information-list.component';
import { OurInformationAddComponent } from './components/our-information-add/our-information-add.component';
import { GameCentreComponent } from './components/game-centre/game-centre.component';
import { CreateLotteryComponent } from './components/create-lottery/create-lottery.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { DatePipe } from '@angular/common';
import { TicketPriceDetailsComponent } from './components/ticket-price-details/ticket-price-details.component';
import { CustomerCareAddComponent } from './components/customer-care-add/customer-care-add.component';
import { CountdownPipe } from './pipes/countdown.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxLoadingModule } from 'ngx-loading';
import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { MyRequestComponent } from './components/my-request/my-request.component';
import { MyRequestApprovedComponent } from './components/my-request-approved/my-request-approved.component';
import { MyRequestRejectedComponent } from './components/my-request-rejected/my-request-rejected.component';
import { BookingRecordsComponent } from './components/booking-records/booking-records.component';
import { BookingReviewComponent } from './components/booking-review/booking-review.component';
import { MatSelectModule } from '@angular/material/select';
import {LotteryResultComponent} from '../app/components/lottery-result/lottery-result.component'
import {MatIconModule} from '@angular/material/icon';
// import {MyRequestComponent} from "./components/my-request/my-request.component"
// import { UiSwitchModule } from 'ngx-toggle-switch';

// import {AccountAddComponent} from './components/account-add/account-add.component'
// import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    // MatSelectModule,
    MyRequestComponent,
    LotteryResultComponent,
    MyRequestApprovedComponent,
    MyRequestRejectedComponent,
    BookingRecordsComponent,
    BookingReviewComponent,
    MainComponent,
    HeaderComponent,
    AsideComponent,
    LoginComponent,
    WalletReivewComponent,
    UserReviewComponent,
    UserReviewViewComponent,
    WalletComponent,
    CreateLotteryComponent,
    AccountAddComponent,
    OurInformationListComponent,
    OurInformationAddComponent,
    GameCentreComponent,
    TicketPriceDetailsComponent,
    CustomerCareAddComponent,
    CountdownPipe,
    DashboardComponent,
    // UiSwitchModule,
    // ColorPickerModule,
    // NgxPaginationModule,
    // RouterModule,
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    AppRoutingModule,
    FormsModule,
    MatCheckboxModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    NgxLoadingModule.forRoot({}),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
