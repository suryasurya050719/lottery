import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../../service/dashboard';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Login } from '../../service/login';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  id: any = '';
  singlrUser: any = '';
  referedUserList: any = '';
  sharedAccount: any = {};
  user_id: string = '';
  phone: string = '';
  role_id = '';

  // card details
  ifsccode: string = '';
  accountnumber: string = '';
  branchName: string = '';
  cardholder: string = '';

  // user name
  userName: string | null = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private login: Login,
    private clipboard: Clipboard
  ) {}
  accountListAdmin: any = [];
  ngOnInit(): void {
    this.id = localStorage.getItem('lottryuserid');
    this.singleUser();
    this.referedUser();
    this.userName = localStorage.getItem('lottryname');
  }
  AdminAccountPopup = false;
  AdminAccountPopupOpen() {
    this.AdminAccountPopup = !this.AdminAccountPopup;
  }
  ClosePaymentPopup() {
    this.AdminAccountPopup = false;
  }
  singleUser() {
    this.login.singleUser(this.id).subscribe((data) => {
      console.log('single user', data);
      this.singlrUser = data.data[0];
      let lengthcheck = data.data[0].accountList.length;
      let lengthss = lengthcheck - 1;
      this.sharedAccount = data.data[0].accountList[lengthss];
      console.log('>>>>', this.sharedAccount);
      this.ifsccode = this.sharedAccount.ifsc_code;
      this.accountnumber = this.sharedAccount.account_number;
      this.branchName = this.sharedAccount.branch_name;
      this.cardholder = this.sharedAccount.account_name;
    });
  }
  copyHeroName(name: any, role_id: any) {
    let copyData =name
      // role_id == 1 ? `BJCD A${name}` : role_id == 2 ? `BJCD B${name}` : '';
    this.clipboard.copy(copyData);
  }
  changeFn() {
    this.referedUser();
  }
  referedUser() {
    this.login
      .referedUser(this.id, this.user_id, this.phone, this.role_id)
      .subscribe((data) => {
        console.log('refered user ', data);
        this.referedUserList = data.data;
      });
  }
}
