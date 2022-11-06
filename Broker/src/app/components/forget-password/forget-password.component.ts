import { Component, OnInit } from '@angular/core';
import { sms } from '../../service/sms';
import { Login } from '../../service/login';
import { ActivatedRoute, Route, Router } from '@angular/router';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(
    private SMS: sms,
    private formBuilder: FormBuilder,
    private login: Login,
    private router: Router
  ) {}
  confirmPassword: string = '';
  password: string = '';
  validOtp: string = '';
  phoneNumber: string = '';
  loginform: FormGroup;
  submitChange: boolean = false;
  ngOnInit(): void {
    this.loginform = this.formBuilder.group(
      {
        Phone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          ],
        ],
        password: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        validOtp: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      }
      // {
      //   validators: [Validation.match('password', 'confirmPassword')] [routerLink]="['/user-review-view']"
      // }
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.loginform.controls;
  }
  sendOtp() {
    // alert(
    //   `${this.validOtp}ffffhf ${this.phoneNumber} jnj ${this.confirmPassword} yyyy ${this.password}`
    // );
    let data = {
      phone: this.phoneNumber,
      type: 'OLD',
    };
    this.SMS.sms(data).subscribe((data) => {
      console.log(data);
      if (data.statuscode == 200) {
        alert('otp send successfully');
      }
    });
  }
  onSubmit() {
    console.log('>>>>>>', this.loginform.invalid);
    if (this.loginform.invalid) {
      this.submitChange = true;
    } else {
      this.submitChange = false;
    }
    if (this.loginform.valid) {
      console.log('dataaaaa', this.password, this.confirmPassword);
      if (this.password == this.confirmPassword) {
        let data = {
          phone: this.phoneNumber,
          validOtp: this.validOtp,
          password: this.password,
        };
        this.login.forgotPassword(data).subscribe((data) => {
          console.log('dta', data);
          alert(`${data.status}`);
          if (data.statuscode == 200) {
            this.router.navigateByUrl('/login');
          }
        });
      }
    }
  }
}
