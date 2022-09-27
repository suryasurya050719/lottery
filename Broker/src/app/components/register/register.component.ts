import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Login } from '../../service/login';
import { sms } from '../../service/sms';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private login: Login,
    private sms: sms,
    private route: ActivatedRoute
  ) {}
  signupform: FormGroup;
  submitChange: boolean = false;
  ReferralCode: string = '';
  username: string = '';
  phonenumber: any = '';
  otp: any = '';
  password: string = '';
  confirmPassword: string = '';
  ngOnInit(): void {
    this.signupform = this.formBuilder.group(
      {
        username: ['', Validators.required],
        ReferralCode: [''],
        otp: ['', [Validators.required]],
        phonenumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          ],
        ],
        // Email: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.pattern(/^\S+@\S+\.\S+$/)
        //   ],
        // ],
        password: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        confirmpassword: ['', Validators.required],
      }
      // {
      //   [validators: [Validation.match('password', 'confirmPassword')] [routerLink]="['/user-review-view']"
      // }
    );
  }
  Submit() {
    if (this.signupform.invalid) {
      this.submitChange = true;
    } else {
      this.submitChange = false;
    }
    console.log('zdfsdf', this.signupform);
    if (this.signupform.valid) {
      if (
        this.signupform.value.confirmpassword === this.signupform.value.password
      ) {
        let data = this.signupform.value;
        let referalID = this.ReferralCode;
        let formdata = {
          phone: data.phonenumber,
          password: data.password,
          referal_code: referalID,
          otp: data.otp,
        };
        this.login.Registor(formdata).subscribe((data: any) => {
          console.log('data', data);
          alert(`${data.status}`);
          if (data.statuscode == 200) {
            this.router.navigateByUrl('/login');
          }
          // this.BrokerPopup = false;
          // this.referedUser();
        });
      } else {
        alert('password and confirmpassword is not same');
      }
    }
  }
  sendOtp() {
    if (this.username == '' || this.phonenumber == '') {
      alert('user name and phone number must have');
    } else {
      let data = {
        phone: this.phonenumber,
        username: this.username,
        role_id: 2,
      };
      this.sms.newuserSms(data).subscribe((data) => {
        alert(`${data.status}`);
      });
    }
  }
}
