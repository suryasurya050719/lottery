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
  accountListBroker: any = [];
  accountListBrokerList: any = [];

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
      this.accountListAdmin = data.data[0].Admin[0].List;
      this.accountListBroker = data.data[0].Broker;
      this.accountListBrokerList = data.data[0].Broker[0].List;
      console.log('this.accountListAdmin', this.accountListAdmin);
    });
  }
  Unpublised(type: any, id: any, customer: any, broker: any) {
    if (confirm('Are you sure you want to change status')) {
      let data: any = {
        id: id,
      };
      if (type == 1) {
        data['customer'] = customer == true ? false : true;
        data['broker'] = broker;
      } else if (type == 2) {
        data['customer'] = customer;
        data['broker'] = broker == true ? false : true;
      }
      this.Dashboard.AccountStatusChange(data).subscribe((data) => {
        console.log('data', data);
        this.getAccount();
      });
    }
  }
  UnpublisedMany(id: any, customer: any) {
    let data = {
      id: id,
      customer: customer == 1 ? true : false,
    };
    console.log('data', data);
    this.Dashboard.ManyAccountStatusChange(data).subscribe((data) => {
      console.log('data', data);
      this.getAccount();
    });
  }
}
