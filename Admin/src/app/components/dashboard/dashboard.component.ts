import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../../service/dashboard';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  pokemonControl = new FormControl('');
  config: any;
  constructor(private Dashboard: Dashboard) {
    this.config = {
      id: 'pagination1',
      currentPage: 1,
      itemsPerPage: 5,
    };
  }
  count: any = [];
  searchBrokerid: string = '';
  accountListAdmin: any = [];
  accountListBroker: any = [];
  accountListBrokerList: any = [];
  checkedValue: boolean = false;

  ngOnInit(): void {
    this.getCount();
    this.getAccount(this.config.currentPage);
    // alert(`>>>>>>>${this.checkedValue}`);
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
  getAccount(newPage: number) {
    console.log('this.searchBrokerid', this.searchBrokerid);
    this.Dashboard.AccountList(this.searchBrokerid).subscribe((data) => {
      this.config.currentPage = newPage;
      console.log('data>>>>>>.', data.data);
      this.accountListAdmin = data.data[0].Admin[0].List;
      this.accountListBroker = data.data[0].Broker;
      this.accountListBrokerList = data.data[0].Broker[0].List;
      console.log('this.accountListAdmin', this.accountListAdmin);
      console.log('this.accountListBroker', this.accountListBroker);
      console.log('this.accountListBroker', this.accountListBrokerList);
    });
  }
  brokersearch() {
    this.getAccount(this.config.currentPage);
  }
  Unpublised(type: any, id: any, customer: any, broker: any) {
    // alert(`>>>>>>>>${this.checkedValue}`);
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
        this.getAccount(this.config.currentPage);
      });
    } else {
      this.getAccount(this.config.currentPage);
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
      this.getAccount(this.config.currentPage);
    });
  }
}
