import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../../service/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private Dashboard: Dashboard) {}
  count: any = [];
  accountListAdmin: any = [];
  ngOnInit(): void {
    this.getCount();
    this.getAccount();
  }
  AdminAccountPopup = false;
  AdminAccountPopupOpen() {
    this.AdminAccountPopup = !this.AdminAccountPopup;
  }
  ClosePaymentPopup() {
    this.AdminAccountPopup = false;
  }
  getCount() {
    this.Dashboard.customerandbrokercount().subscribe((data) => {
      console.log('data', data.data[0]);
      this.count = data.data[0];
    });
  }
  getAccount() {
    this.Dashboard.AccountList().subscribe((data) => {
      console.log('data', data.data[0]);
      this.accountListAdmin = data.data[0]?.Admin;
      console.log('this.accountListAdmin', this.accountListAdmin);
    });
  }
}
