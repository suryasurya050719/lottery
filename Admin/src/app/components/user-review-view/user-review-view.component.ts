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
  referedUserList: any = '';
  user_id: string = '';
  phone: string = '';
  role_id = '';
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