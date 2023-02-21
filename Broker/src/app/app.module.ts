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
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { WalletComponent } from '../app/components/wallet/wallet.component';
import { CustomerCareListComponent } from '../app/components/customer-care-list/customer-care-list.component';
import { GameCentreComponent } from '../app/components/game-centre/game-centre.component';
import { TicketPriceDetailsComponent } from '../app/components/ticket-price-details/ticket-price-details.component';
import { AccountAddComponent } from '../app/components/account-add/account-add.component';
import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { BookingRecordsComponent } from './components/booking-records/booking-records.component';
import { BookingReviewComponent } from './components/booking-review/booking-review.component';
import { MatSelectModule } from '@angular/material/select';

// import {RegisterComponent} from './components/register/RegisterComponent'
// import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    AsideComponent,
    BookingRecordsComponent,
    BookingReviewComponent,
    LoginComponent,
    RegisterComponent,
    WalletReivewComponent,
    UserReviewComponent,
    UserReviewViewComponent,
    ForgetPasswordComponent,
    WalletComponent,
    CustomerCareListComponent,
    GameCentreComponent,
    TicketPriceDetailsComponent,
    AccountAddComponent,
    DashboardComponent,
    // NgxPaginationModule,
    // RouterModule,
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    MatSelectModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
