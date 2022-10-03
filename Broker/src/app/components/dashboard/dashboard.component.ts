import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../../service/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private Dashboard: Dashboard) {}
  accountListAdmin: any = [];
  ngOnInit(): void {}
  AdminAccountPopup = false;
  AdminAccountPopupOpen() {
    this.AdminAccountPopup = !this.AdminAccountPopup;
  }
  ClosePaymentPopup() {
    this.AdminAccountPopup = false;
  }
}
