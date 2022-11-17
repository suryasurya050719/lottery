import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Login } from '../../service/login';

@Component({
  selector: 'app-user-review-view',
  templateUrl: './user-review-view.component.html',
  styleUrls: ['./user-review-view.component.css'],
})
export class UserReviewViewComponent implements OnInit {
  id: any = '';
  singlrUser: any = '';
  sharedAccount: any = {};
  referedUserList: any = '';
  user_id: string = '';
  phone: string = '';
  role_id = '';

  // card details
  ifsccode: string = '';
  accountnumber: string = '';
  branchName: string = '';
  cardholder: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private login: Login
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.singleUser();
    this.referedUser();
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
